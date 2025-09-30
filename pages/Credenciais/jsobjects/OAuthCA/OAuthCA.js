export default {
  async start() {
    const cli = tabClientes.triggeredRow || tabClientes.selectedRow;
    if (!cli?.id) { showAlert("Selecione um cliente.", "warning"); return; }

    const app = await getCAApp.run();            // SELECT id, client_id, client_secret, redirect_uri ... (ver SQL abaixo)
    const clientId   = app?.[0]?.client_id;
    const redirect   = (app?.[0]?.redirect_uri || "").split("?")[0].replace(/\/edit$/,"");
    const appId      = app?.[0]?.id;

    if (!clientId || !redirect || !appId) {
      showAlert("Credenciais do Conta Azul ausentes.", "error");
      return;
    }

    const label = (inpNomeConexao.text || `lic-${Date.now()}`).toLowerCase().replace(/\s+/g,"-");
    // payload sem segredos; vai codificado no state
    const payload = {
      n: self.crypto?.randomUUID?.() || Math.random().toString(36).slice(2), // nonce
      client_row_id: cli.id,
      app_id: appId,
      conn_label: label
    };
    const state = btoa(JSON.stringify(payload));

    const authUrl =
      `https://auth.contaazul.com/oauth2/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirect)}` +
      `&state=${state}` +
      `&scope=${encodeURIComponent('openid profile aws.cognito.signin.user.admin')}`;

    navigateTo(authUrl, {}, "SAME_WINDOW");
  }
}
