export default {
  ctx() {
    try { return JSON.parse(atob(appsmith.URL.queryParams.state || "")) || {}; }
    catch { return {}; }
  },

  async handle() {
    const code = appsmith.URL.queryParams.code;
    if (!code) return;

    const s = this.ctx(); // { client_row_id, app_id, conn_label }
    if (!s.client_row_id || !s.app_id) {
      showAlert("State inválido/sessão perdida. Clique em Conectar novamente.", "error");
      return;
    }

    await getCAApp.run();          // precisa vir antes do CA_Token
    const tok = await CA_Token.run();    // troca code -> token
    await saveTokens.run({               // salva no modelo explícito
      client_id:  s.client_row_id,
      app_id:     s.app_id,
      conn_label: s.conn_label || "default",
      code
    });

    showAlert("Conta Azul conectada!", "success");
    navigateTo("Credenciais");
  }
}
