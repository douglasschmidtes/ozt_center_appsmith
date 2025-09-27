export default {
	criarHash: (senha) => {
		const saltRounds = 10;
		const salt = bcrypt.genSaltSync(saltRounds);
		const senhaHash = bcrypt.hashSync(senha,salt);
		return senhaHash		
	},
	verificarHash: (senha,hash) => {
		return bcrypt.compareSync(senha, hash);
	},
	criarToken: (email,nome) => {
		const options = { expiresIn: "360m"};
		const token = jsonwebtoken.sign({email,nome},'151681321svasdvsxfr', options);
		
		return token;
	},
	registar:()=>{
		const nome = inpNomeRegistrar.text;
		const email = inpEmailRegistrar.text;
		const senha = inpSenhaRegistrar.text;
		
		// Criptografar a senha (Hash)
		const senhaComHash = this.criarHash(senha)
		
		return Registrar.run({nome,email,senhaComHash})
	},
	entrar: async () => {
		const email = inpEmail.text;
		const senha = inpSenha.text;
		
		
		const [usuario] = await ObterUsuario.run({email});
		
		if(usuario && this.verificarHash(senha,usuario?.password)) {
			const nome = usuario?.name;
			const token = this.criarToken(email,nome);
			
			storeValue('token',token)
				.then(()=>navigateTo('Home'));
			
		} else {
			showAlert('Email ou senha inválido!');
		}
	}
	
}