from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from apps.escala.models import SolicitacaoFolga


class SolicitacaoFolgaTestCase(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True
        )
    
    def test_criar_solicitacao_valida(self):
        folga = SolicitacaoFolga.objects.create(
            usuario=self.user,
            cartomante_nome='Madame Zelda',
            dia_semana='segunda',
            turno='manha'
        )
        
        self.assertEqual(folga.status, 'pendente')
        self.assertIsNotNone(folga.data_solicitacao)
        self.assertIsNone(folga.data_acao)
        self.assertEqual(str(folga), 'Madame Zelda - Segunda-feira (Manhã) - Pendente')
    
    def test_limite_folgas_por_semana(self):
        dias = ['segunda', 'terca', 'quarta']
        for dia in dias:
            SolicitacaoFolga.objects.create(
                usuario=self.user,
                cartomante_nome='Madame Zelda',
                dia_semana=dia,
                turno='manha'
            )
        
        with self.assertRaises(ValidationError):
            folga = SolicitacaoFolga(
                usuario=self.user,
                cartomante_nome='Madame Zelda',
                dia_semana='quinta',
                turno='manha'
            )
            folga.full_clean()
    
    def test_duplicata_folga(self):
        SolicitacaoFolga.objects.create(
            usuario=self.user,
            cartomante_nome='Madame Zelda',
            dia_semana='segunda',
            turno='manha'
        )
        
        with self.assertRaises(ValidationError):
            folga = SolicitacaoFolga(
                usuario=self.user,
                cartomante_nome='Outro Nome',
                dia_semana='segunda',
                turno='manha'
            )
            folga.full_clean()
    
    def test_atualização_data_acao(self):
        folga = SolicitacaoFolga.objects.create(
            usuario=self.user,
            cartomante_nome='Madame Zelda',
            dia_semana='segunda',
            turno='manha'
        )
        
        self.assertIsNone(folga.data_acao)
        
        folga.status = 'aprovada'
        folga.aprovado_por = self.admin_user
        folga.save()
        
        folga.refresh_from_db()
        self.assertIsNotNone(folga.data_acao)
        self.assertEqual(folga.aprovado_por, self.admin_user)
    
    def test_folga_recusada_nao_conta_no_limite(self):
        for i in range(3):
            SolicitacaoFolga.objects.create(
                usuario=self.user,
                cartomante_nome='Madame Zelda',
                dia_semana=['segunda', 'terca', 'quarta'][i],
                turno='manha',
                status='recusada'
            )
        
        folga = SolicitacaoFolga(
            usuario=self.user,
            cartomante_nome='Madame Zelda',
            dia_semana='quinta',
            turno='manha'
        )
        folga.full_clean()
        folga.save()
        
        self.assertEqual(folga.status, 'pendente')
