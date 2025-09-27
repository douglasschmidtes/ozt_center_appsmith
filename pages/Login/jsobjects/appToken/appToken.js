export default {
	isLogged: () => {
		try{
				const decoded = jsonwebtoken.verify(appsmith.store.token, '151681321svasdvsxfr');
				
				const now = Math.floor(Date.now() / 1000 );
			
				if(decoded.exp && decoded.exp < now) {
					console.error("Token expirado");
					return {valid : false, expired: true, decoded: null};
				}
		
				console.log("Token válido", decoded);
				return {valid : true, expired: false, decoded};
			
     }catch(error){
				if(error.name === "TokenExpiredError") {
					console.error("Token expirado pela lib");
					return {valid : false, expired: true, decoded: null};
				} else {
					console.error("Token inválido", error.message);
					return {valid : false, expired: true, decoded: null};
				}
			 
     }
	},
	
	onLoad: () => {
		const content = this.isLogged();
		
		if(content.valid) {
			navigateTo('Home');
		}
	}
}