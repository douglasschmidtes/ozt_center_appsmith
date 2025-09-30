export default {
  start() {
    const cli = tabClientes.selectedRow;         // linha selecionada
    if (!cli?.id) { showAlert("Selecione um cliente.", "warning"); return; }

    const clientId = getCAApp.data[0].client_id;
    const redirectUri = getCAApp.data[0].redirect_uri;

    // anti-CSRF
    const state = (self.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    storeValue('ca_state', state);
    storeValue('ca_client_row_id', cli.id);      // quem estou conectando?

    const authUrl =
      `https://auth.contaazul.com/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}` +
      `&scope=${encodeURIComponent('openid profile aws.cognito.signin.user.admin')}`;

    navigateTo(authUrl, {}, 'SAME_WINDOW');
  }
}
