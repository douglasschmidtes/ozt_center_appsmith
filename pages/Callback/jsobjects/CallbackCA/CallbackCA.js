export default {
  async handle() {
    const code  = appsmith.URL.queryParams.code;
    const state = appsmith.URL.queryParams.state;

    if (!code) return; // abriu a página sem ?code, não faz nada

    // anti-CSRF: compara state
    if (state !== appsmith.store.ca_state) {
      showAlert("State inválido. Tente novamente.", "error");
      return;
    }

    try {
			await getCAApp.run(); // Pega Credendiais
      await CA_Token.run();     // troca code -> token
      await saveTokens.run();   // grava no Postgres e cria os vínculos M2M
      showAlert("Conta Azul conectada!", "success");
      navigateTo("Credenciais"); // volte para a página principal
    } catch (e) {
      showAlert("Falha ao finalizar conexão: " + (e?.message || e), "error");
    }
  }
}
