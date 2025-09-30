export default {
  async start() {
    try {
      const cli = tabClientes.triggeredRow; // linha selecionada
      if (!cli?.id) { showAlert("Selecione um cliente.", "warning"); return; }

      // Busca fresca das credenciais
      const app = await getCAApp.run();        // <- AQUI
      const clientId = app?.[0]?.client_id;
      const redirectUri = app?.[0]?.redirect_uri;

      if (!clientId || !redirectUri) {
        showAlert("Credenciais do Conta Azul ausentes.", "error");
        return;
      }
			// Entrada do usuário (pode ser via Input/Modal). Fallback para timestamp.
    	const label = (inpNomeConexao.text || `lic-${Date.now()}`)
                    .toLowerCase().replace(/\s+/g,'-');
      // anti-CSRF
      const state = (self.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
      await storeValue('ca_state', state);
      await storeValue('ca_client_row_id', cli.id);
			await storeValue('conn_label', label)

      const authUrl =
        `https://auth.contaazul.com/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${state}` +
        `&scope=${encodeURIComponent('openid profile aws.cognito.signin.user.admin')}`;

      navigateTo(authUrl, {}, 'SAME_WINDOW');
    } catch (e) {
      showAlert("Erro ao obter dados do app Conta Azul.", "error");
      console.error(e);
    }
  }
}
