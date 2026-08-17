from django.test import TestCase
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from apps.escala.models import SolicitacaoFolga


class SolicitacaoFolgaAPITestCase(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        cache.clear()
        
        self.user = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='pass123'
        )
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass',
            is_staff=True
        )
        
        self.folga1 = SolicitacaoFolga.objects.create(
            usuario=self.user,
            cartomante_nome='Madame Zelda',
            dia_semana='segunda',
            turno='manha'
        )
    
    def test_listar_folgas_sem_autenticacao(self):
        response = self.client.get('/api/solicitacoes/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_listar_folgas_autenticado(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/solicitacoes/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_usuario_comum_nao_acessa_folga_de_outro_usuario(self):
        outro_usuario = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123456',
        )
        outra_folga = SolicitacaoFolga.objects.create(
            usuario=outro_usuario,
            cartomante_nome='Outra Cartomante',
            dia_semana='terca',
            turno='tarde',
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/api/solicitacoes/{outra_folga.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_usuario_comum_nao_altera_ou_exclui_folga(self):
        self.client.force_authenticate(user=self.user)

        patch_response = self.client.patch(
            f'/api/solicitacoes/{self.folga1.id}/',
            {'status': 'aprovada'},
        )
        delete_response = self.client.delete(f'/api/solicitacoes/{self.folga1.id}/')

        self.assertEqual(patch_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_criar_folga(self):
        self.client.force_authenticate(user=self.user)
        
        data = {
            'cartomante_nome': 'Cigana Rosa',
            'dia_semana': 'terca',
            'turno': 'tarde'
        }
        
        response = self.client.post('/api/solicitacoes/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['cartomante_nome'], 'Cigana Rosa')
        self.assertEqual(response.data['status'], 'pendente')

    def test_criar_folga_sem_autenticacao_e_bloqueado(self):
        response = self.client.post('/api/solicitacoes/', {
            'cartomante_nome': 'Cigana Rosa',
            'dia_semana': 'terca',
            'turno': 'tarde',
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_solicitacao_publica_cria_registro_sem_expor_dados_internos(self):
        response = self.client.post('/api/solicitacoes/publicar/', {
            'cartomante_nome': 'Cigana Rosa',
            'dia_semana': 'terca',
            'turno': 'tarde',
            'status': 'aprovada',
            'usuario': self.admin.id,
            'observacao': 'Tentativa de alterar campos internos',
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, {'detail': 'Solicitação enviada para análise.'})

        folga_publica = SolicitacaoFolga.objects.get(cartomante_nome='Cigana Rosa')
        self.assertIsNone(folga_publica.usuario)
        self.assertEqual(folga_publica.status, 'pendente')
        self.assertEqual(folga_publica.observacao, '')

    def test_solicitacao_publica_nao_permite_listagem(self):
        response = self.client.get('/api/solicitacoes/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_solicitacao_publica_tem_limite_de_taxa(self):
        requests = []
        for index in range(6):
            requests.append(self.client.post('/api/solicitacoes/publicar/', {
                'cartomante_nome': f'Cartomante Pública {index}',
                'dia_semana': 'segunda',
                'turno': 'manha',
            }))

        self.assertTrue(all(response.status_code == status.HTTP_201_CREATED for response in requests[:5]))
        self.assertEqual(requests[5].status_code, status.HTTP_429_TOO_MANY_REQUESTS)
    
    def test_aprovar_folga_como_admin(self):
        self.client.force_authenticate(user=self.admin)
        
        response = self.client.post(f'/api/solicitacoes/{self.folga1.id}/aprovar/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'aprovada')
        
        self.folga1.refresh_from_db()
        self.assertEqual(self.folga1.status, 'aprovada')
        self.assertEqual(self.folga1.aprovado_por, self.admin)
    
    def test_aprovar_folga_como_user_comum(self):
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(f'/api/solicitacoes/{self.folga1.id}/aprovar/')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_recusar_folga(self):
        self.client.force_authenticate(user=self.admin)
        
        data = {'observacao': 'Já temos muitas folgas nesse dia'}
        response = self.client.post(
            f'/api/solicitacoes/{self.folga1.id}/recusar/',
            data
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'recusada')
        self.assertEqual(response.data['observacao'], 'Já temos muitas folgas nesse dia')
    
    def test_estatisticas(self):
        self.client.force_authenticate(user=self.admin)
        
        response = self.client.get('/api/solicitacoes/estatisticas/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total', response.data)
        self.assertIn('pendentes', response.data)
        self.assertIn('aprovadas', response.data)
        self.assertIn('recusadas', response.data)

    def test_estatisticas_exigem_admin(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get('/api/solicitacoes/estatisticas/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AuthenticationAPITestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        cache.clear()
        self.user = User.objects.create_user(
            username='session-user',
            email='session@example.com',
            password='pass123456',
        )
        self.admin = User.objects.create_user(
            username='session-admin',
            email='admin-session@example.com',
            password='pass123456',
            is_staff=True,
        )

    def test_login_admin_retorna_sessao_com_permissao_administrativa(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'session-admin',
            'password': 'pass123456',
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['user']['is_staff'])
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_logout_revoga_refresh_token(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.force_authenticate(user=self.user)

        logout_response = self.client.post('/api/auth/logout/', {'refresh': str(refresh)})
        refresh_response = self.client.post('/api/auth/token/refresh/', {'refresh': str(refresh)})

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cadastro_publico_tem_limite_de_taxa(self):
        responses = []
        for index in range(6):
            responses.append(self.client.post('/api/auth/register/', {
                'username': f'new-user-{index}',
                'email': f'new-user-{index}@example.com',
                'password': 'SenhaSegura123!',
                'password2': 'SenhaSegura123!',
            }))

        self.assertTrue(all(response.status_code == status.HTTP_201_CREATED for response in responses[:5]))
        self.assertEqual(responses[5].status_code, status.HTTP_429_TOO_MANY_REQUESTS)
