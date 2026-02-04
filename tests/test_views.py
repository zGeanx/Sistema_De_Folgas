from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from apps.escala.models import SolicitacaoFolga


class SolicitacaoFolgaAPITestCase(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        
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
        self.assertEqual(len(response.data), 1)
    
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
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get('/api/solicitacoes/estatisticas/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total', response.data)
        self.assertIn('pendentes', response.data)
        self.assertIn('aprovadas', response.data)
        self.assertIn('recusadas', response.data)
