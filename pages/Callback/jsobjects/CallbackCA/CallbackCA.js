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
      UI.setStatus("State inválido/sessão perdida. Clique em Conectar novamente.", 100);
      showAlert("State inválido/sessão perdida. Clique em Conectar novamente.", "error");
      return;
    }

    try {
      // (Se estiver usando Modal)
      // showModal('mdlLoading');

      UI.setStatus("Conectando à Conta Azul…", 10);
      await UI.sleep(200);

      UI.setStatus("Carregando credenciais do app…", 30);
      await getCAApp.run();

      UI.setStatus("Trocando código por token…", 60);
      const tok = await CA_Token.run();

      UI.setStatus("Salvando tokens…", 85);
      await saveTokens.run({
        client_id:  s.client_row_id,
        app_id:     s.app_id,
        conn_label: s.conn_label || "default",
        code
      });

      UI.setStatus("Conexão concluída!", 100);
      showAlert("Conta Azul conectada!", "success");
      await UI.sleep(600);

      // closeModal('mdlLoading');
      navigateTo("Credenciais");
    } catch (e) {
      UI.setStatus("Falha ao conectar. Tente novamente.", 100);
      showAlert("Falha ao finalizar conexão: " + (e?.message || e), "error");
      // closeModal('mdlLoading');
    }
  }
}
