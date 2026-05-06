var scmFichaPrePedido = {
    
	contaContabil               : '',
	PS2_CONTA                   : '',
	ACAO                        : '',
	gerarPed                    : 'N',
	chamaParcelas               : '',
    UFDEST                      : '',
	UFORIG                      : '',
	transportadora              : '',
	nSalvarDinamico             : 0,
	totalLiquido                : 0,
	nInputDinamico              : 0,
	EMPFIL_ADHOC                : tpGetEmpFil(),
	oDados                      : {},
	data                        : {},
	aData                       : [],
	grupoAprov                  : [],
	dados_rateio_cc             : [],
    dados_rateio_conta          : [],
    dados_rateio_item_conta     : [],
    dados_rateio_classe_valor   : [],
    dados_rateio_pco            : [],
    dados_rateio_geral          : [],
	aDataSolOrc                 : [],
	FLUXO_PADRAO_GERAPC         : getTetrisParams("SCM_FLUXO_PADRAO_GERAPC"    ,"SCM"),
	contrato                    : '',
	tipoPlanilha                : '',
	idCodPla                    : '',
	cFull	                    : {},
	dadosPS2                    : '',	
	idUltimoItemAlterado        : '',

    /*== INTEGRAÇÕES ==*/
	integraAPISAP               : getTetrisParams("SCM_HABILITA_API_SAPBUSINESSONE","SCM"),
	integraAPISAPS4             : getTetrisParams("SCM_HABILITA_API_SAP_S4HANA","SCM"), 
	parametroIntegracaoAPISAP   : getTetrisParams('SCM_API_SAP_PARAMETROS_INTEGRACAO'),							 
	integraAPIOMIE              : getTetrisParams('SCM_HABILITA_API_OMIE','SCM'),
    integraAPIERPFlex           : getTetrisParams('SCM_HABILITA_API_ERPFLEX','SCM'),
    integraAPIPROTHEUS          : getTetrisParams('SCM_HABILITA_API_PROTHEUS','SCM'),
    SCM_HABILITA_API_WEBPOSTO   : getTetrisParams("SCM_HABILITA_API_WEBPOSTO"  ,"SCM"),
    

	resetPrePed: function(){
	    this.ACAO = '';
	},
	persistir: function (oDados) {
		this.oDados = oDados;
		this.aData = ajustaraData(oDados);
		if (this.aData.length > 0) {
			this.data = this.aData[0];
		}
	},
	resetItem: function(){
	    this.PS2_CONTA = '';
	},
	item: {
		oDados: {},
		aData: [],
		data: {},
		persistir: function (oDados) {
			this.oDados = oDados;
			this.aData = ajustaraData(oDados);
			if (this.aData.length > 0) {
				this.data = this.aData[0];
			}
		}
	},
	monitorarAlteracoesCabecalho: function () {
		var aMap = [];
		aMap.push({ inputId: "ddlCondPag"     , campo: "PS2_COND" });
		aMap.push({ inputId: "txtObsPagto"    , campo: "PS2_OBSPGT" });
		aMap.push({ inputId: "ddlFrete"       , campo: "PS2_TPFRET" });
		aMap.push({ inputId: "txtValorFrete"  , campo: "PS2_VLFRET" });
		aMap.push({ inputId: "txtValorSeguro" , campo: "PS2_VLSEGU" });
        aMap.push({ inputId: "txtContato"     , campo: "PS2_CONTAT" });
		aMap.push({ inputId: "PS2_JUSTIF"     , campo: "PS2_JUSTIF" });
		aMap.push({ inputId: "ddlMoeda"       , campo: "PS2_MOEDA" });
		aMap.push({ inputId: "txtValorDespesa", campo: "PS2_DESPES" });
		var isChange = false;

		try {
			for (var i = 0; i < aMap.length; i++) {
				var valCampo = this.data[aMap[i].campo].trim();
				var valInput = $(tpSelector('#' + aMap[i].inputId)).val().trim();
				if (valCampo == "0" && valInput == "") {
					if (aMap[i].campo == "PS2_VLFRET" || aMap[i].campo == "PS2_VLSEGU" || aMap[i].campo == "PS2_DESPES") {
						valInput = "0";
					}
				}
				if (valInput != valCampo) {
					isChange = true;
				}
			}
		}
		catch (e) { }

		try {
			var ddlFornecedor = $(tpSelector('#ddlFornecedor')).select2('data');
			var PS2_FORNEC = ddlFornecedor.id.split('/')[0].trim();			/* PS2_FORNEC */
			var PS2_LOJA = ddlFornecedor.id.split('/')[1].trim();			/* PS2_LOJA */
			var PS2_FORDES = ddlFornecedor.text.split(' - ')[1].trim();	//'';

			if (PS2_FORNEC != scmFichaPrePedido.data.PS2_FORNEC.trim()) {
				isChange = true;
			}

			if (PS2_LOJA != scmFichaPrePedido.data.PS2_LOJA.trim()) {
				isChange = true;
			}

			if (PS2_FORDES != scmFichaPrePedido.data.PS2_FORDES.trim()) {
				isChange = true;
			}
		}
		catch (e) { }

		if (isChange) {
			$(tpSelector('#btnSalvar')).show();
			$(tpSelector('#btnFinalizar')).show();
		}
	},
	callbackVoltar:                         '',
	solicitanteCCusto:                      '',
	aCCXLinha:                              {},
	habilitaCamposProjeto: 	                getTetrisParams('HABILITA_CAMPOS_PROJETO'),
	habilitaCamposVerba: 	                getTetrisParams('HABILITA_CAMPOS_VERBA'),
	habilitaCampoAprovador:                 getTetrisParams('HABILITA_CAMPOPP_APROVADOR'),
	habilitaCampoOrcamento:                 getTetrisParams('HABILITA_CAMPOPP_ORCAMENTO'),
	habilitaCampoVencimento:                getTetrisParams('HABILITA_CAMPOPP_VENCIMENTO'),
	habilitaCentroCusto:                    getTetrisParams('EXIBE_CC','SCM'),
    habilitaClasseValor:                    getTetrisParams('EXIBE_CLVL','SCM'),
    habilitaContaContabil:                  getTetrisParams('EXIBE_CONTA_CONTABIL','SCM'),
    habilitaItContabil:                     getTetrisParams('EXIBE_IT_CONTABIL','SCM'),
    habilitaPCO:                            getTetrisParams('EXIBE_PCO','SCM'),
    habilitaContingencia:                   getTetrisParams('SCM_HABILITA_CONTINGENCIA','SCM'),
    habilitaDescricaoSubst:                 getTetrisParams('DESCRICAO_SUBSTITUTA','SCM'),
    habilitaNatureza:                       getTetrisParams('EXIBE_NATUREZA','SCM'),
    habilitaEntObra:                        getTetrisParams('EXIBE_ENTREGAOBRA','SCM'),
    habilitaAdiantamento:                   getTetrisParams('EXIBE_ADIANTAMENTO','SCM'),
    habilitaGrpAprova:                      getTetrisParams('HABILITA_GRUPO_APROV_PREPEDIDO','SCM'),
    habilitaTabelaPreco:                    getTetrisParams('HABILITA_TABELA_PRECO_PRE_PEDIDO','SCM'),
    habilitaDataEmissao:                    getTetrisParams('SCM_ALTERA_DATA_EMISSAO_PRE_PEDIDO','SCM'),
    habilitaProjeto:                        getTetrisParams('SCM_HABILITA_CAMPO_PROJETO_PP','SCM'),
    habilitaCampoRevisao:                   getTetrisParams('SCM_HABILITA_CAMPO_REVISAO_PP','SCM'),
    habilitaCampoTarefa:                    getTetrisParams('SCM_HABILITA_CAMPO_TAREFA_PP','SCM'),
    habilitaCampoOrdemProd:                 getTetrisParams('SCM_HABILITA_ORDEM_PRODUCAO','SCM'),
    habilitaAnexo:                          getTetrisParams('SCM_UTILIZA_ANEXO_PRE_PEDIDO','SCM'),
    nomeLocalEntrega:                       getTetrisParams('SCM_NOME_LOCAL_ENTREGA','SCM'),
    habilitaCamposRastreia:                 getTetrisParams('SCM_HABILITA_CAMPOS_RASTREIO_PREPEDIDO','SCM'),
    habilitaAlterarContaContab:             getTetrisParams('SCM_HABILITA_ALTERAR_CONTA_CONTABIL_PRE_PEDIDO','SCM'),
    habilitaCampoLocal:                     getTetrisParams('SCM_HABILITA_CAMPO_LOCAL','SCM'),
    habilitaEdicapUnidadeMedida:            getTetrisParams('SCM_PERMISSAO_PARA_ALTERAR_UNIDADE_DE_MEDIDA'),
    habilitaCampoSolicitacaoCompra:         getTetrisParams('UTILIZA_TIPO_SC','SCM'),
    habilitaObservacaoFornecedor:           getTetrisParams('EXIBE_OBS_FORNEC','SCM'),
    habilitaInclusaoProdutoFichaPrePedido:  getTetrisParams('HABILITA_INCLUSAO_PRODUTO_FICHA_PRE_SOLICITACAO_CO','SCM'),
    habilitaIclusaoEdicaoFornecedorFicha:   getTetrisParams('HABILITA_INCLUSAO_FORNECEDOR_PRE_PEDIDO_E_SOL_PAG','SCM'),
	habilitaBaseImposto:                    getTetrisParams('SCM_HABILITA_BASE_IMPOSTO_RETIDO'),
	defineEnvioAutomatico:                  getTetrisParams('SCM_DEFINE_ENVIO_EMAIL_AUTOMATICO', 'SCM'),
	habilitaCampoAutFat:                    getTetrisParams('SCM_HABILITA_AUTORIZA_FATURAMENTO', 'SCM'),
	opcoesModalidade:                       getTetrisParams('SCM_MODALIDADES_UTILIZADAS','SCM'),
	habilitaIncluirAprovadores:             getTetrisParams('SCM_HABILITA_INCLUIR_APROVADOR_PEDIDO_COMPRA','SCM'),
	habilitaComexImportacao:                getTetrisParams('SCM_USA_COMEX_IMPORTACAO', 'SCM'), //Felipe Calori
    habilitaContatoFornecedor:              getTetrisParams('SCM_HABILITA_CONTATO_FORNECEDOR', 'SCM'),
    defineMoedas:                           getTetrisParams("MOEDAS_UTILIZADAS", 'SCM'),
	moedaDefault:                           getTetrisParams("SCM_MOEDA_PADRAO_COTACAO", 'SCM'),
	validaCCustoPCO:                        getTetrisParams('SCM_VALIDA_CENTRO_CUSTO_PCO','SCM'),
	validaFilEntPCO:                        getTetrisParams('SCM_VALIDA_LOCAL_ENTREGA_PCO','SCM'),
	tipoFreteObrigatorioPP:                 getTetrisParams('SCM_TIPOFRETE_OBRIGAT_PP','SCM'),
	justificativaObrigatorioPP:             getTetrisParams('SCM_JUSTIFICATIVA_OBRIGAT_PP','SCM'),
	msgPedidoObrigatorio:                   getTetrisParams('DEFINE_MSGPEDIDO_OBRIGATORIO'),
	entidadePlanilha:                       getTetrisParams('ENTIDADE_PLANILHAORC'),
	entidadeContaOrc:                       getTetrisParams('ENTIDADE_CONTAORC'),
	habilitaResponsaveis:                   getTetrisParams('HABILITA_CAMPO_RESPONSAVEIS_ENVOLVIDOS_SC'),
	habilitaInfGeraisEReqTec:               getTetrisParams('HABILITA_INF_GERAIS_E_REQ_TECNICOS'),
	defineDtLancamento:                     '', 
	habilitaMensagemPedido:                 getTetrisParams('SCM_HABILITA_MENSAGEM_PEDIDO_COTACAO'),
	habilitaUMCadastrada:                   getTetrisParams('SCM_HABILITA_UNIDADE_MEDIDA_CADASTRADA'),
	habilitaFiltroCOCC:                     getTetrisParams('FILTRO_CONTA_ORC_CC'),
	habilitaFiltroCOLE:                     getTetrisParams('FILTRO_CONTA_ORC_LOCAL_ENT'),
	defineModeloCondPag:                    getTetrisParams('DEFINE_MODELO_CONDICAO_DE_PAGAMENTO','SCM'),
	utilContaCorrente:                      getTetrisParams('SCM_UTILIZA_CONTA_CORRENTE_COND_PAG_COMPLETA','SCM'),
	utilTipoDoc:                            getTetrisParams('SCM_UTILIZA_TIPO_DOCUMENTO_COND_PAG_COMPLETA','SCM'),
	habilitaGerarPa:                        getTetrisParams('SCM_HABILITA_GERAR_PA_VIA_PEDIDO','SCM'),
	habilitaDescEntCont:                    getTetrisParams('HABILITA_DESC_ENT_CONTABIL_CLASSIF'),
	habilitaPlacaChassi:                    getTetrisParams("CONTROLE_PLACA_CHASSI",'SCM'), 
	habilitaRegraTipoSC:                    getTetrisParams("HABILITA_INCLUSAO_SC_POR_TIPO_SC",'SCM'),
	nomeLocalFat:                           getTetrisParams("SCM_NOME_LOCAL_FATURAMENTO",'SCM'),
};

function scmFichaPrePedido_ajustarLayout() {
    $($(tpSelector('#PS1_COPCOM')).siblings()[0]).text('Copiar ' + getTetrisParams('ENTIDADE_COMPRADOR') + ' no E-mail do Pedido ?');
	
	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM048');
	tpParam.AddParams('PSH_ID', $(tpSelector('#ddlSolicitante')).val());
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

	var oDados = tpParam.SendFormPost('WSGETCONS');

	if (oDados.errorcode == '00') {

		var aData = ajustaraData(oDados);

		if (aData.length > 0) {
			var data = aData[0];

			if (data.PSH_TPSOL == 'O') { /* O = OEM */
				$(tpSelector('#divSolicitanteOEM')).show();
				scmFichaPrePedido_initDdlTipoEquipamento()
			}
			else {
				$(tpSelector('#divSolicitanteOEM')).hide();
			}
		}
	}
}

function scmFichaPrePedido_habilitaCamposParametrizados(){
    tpDisable("#optAutEnt")
    scmBuscaComprador(usuarioLogado.codigoUsuario())
    scmFichaPrePedido.idUltimoItemAlterado = '';
    //scmFichaPrePedido.habilitaCamposProjeto     ? $('#camposProjeto').css('display', 'block') : $('#camposProjeto').css('display', 'none');
    //scmFichaPrePedido.habilitaCampoSolicitacaoCompra =='S'
	scmFichaPrePedido.habilitaCamposVerba      && $(tpSelector('#ddlCentroCusto')).on('change', function(){ return scmFichaPrePedido_initDdlVerba(); });
	scmFichaPrePedido.habilitaFiltroCOCC == 'S'             ? $(tpSelector('#ddlCentroCusto')).on('change', function(){ return scmFichaPrePedido_initDdlContaOrc(); }):'';
	scmFichaPrePedido.habilitaFiltroCOLE == 'S'             ? $(tpSelector('#ddlEntregar')).on('change', function(){ return scmFichaPrePedido_initDdlContaOrc(); }):'';																																							
    scmFichaPrePedido.habilitaCamposVerba                   ? $(tpSelector('#campoVerba')).css('display', 'block')          : $(tpSelector('#campoVerba')).css('display', 'none');
	scmFichaPrePedido.habilitaCampoAprovador                ? $(tpSelector('#campoAprovador')).css('display', 'block')      : $(tpSelector('#campoAprovador')).css('display', 'none');
    scmFichaPrePedido.habilitaCampoOrcamento                ? $(tpSelector('#campoOrcamento')).css('display', 'block')      : $(tpSelector('#campoOrcamento')).css('display', 'none');
    scmFichaPrePedido.habilitaCampoVencimento               ? $(tpSelector('#campoVencimento')).css('display', 'block')     : $(tpSelector('#campoVencimento')).css('display', 'none');
    scmFichaPrePedido.habilitaGrpAprova                     ? $(tpSelector('#divGrpAprovador')).css('display', 'block')     : $(tpSelector('#divGrpAprovador')).css('display', 'none');
    scmFichaPrePedido.habilitaProjeto == 'S'                ? $(tpSelector('#divProjeto')).css('display', 'block')          : $(tpSelector('#divProjeto')).css('display', 'none');
    scmFichaPrePedido.habilitaCampoRevisao == 'S'           ? $(tpSelector('#divRevisao')).css('display', 'block')          : $(tpSelector('#divRevisao')).css('display', 'none');
    scmFichaPrePedido.habilitaCampoTarefa == 'S'            ? $(tpSelector('#divTarefa')).css('display', 'block')           : $(tpSelector('#divTarefa')).css('display', 'none');
    scmFichaPrePedido.habilitaCamposRastreia == "S"         ? $(tpSelector('#divcamposRastreia')).css('display', 'block')   : $(tpSelector('#divcamposRastreia')).css('display', 'none');
    scmFichaPrePedido.habilitaAlterarContaContab == 'S'     ? $(tpSelector('#PS2_CONTA')).attr('disabled', false)           : $(tpSelector('#PS2_CONTA')).attr('disabled', true);
    scmFichaPrePedido.habilitaObservacaoFornecedor == 'S'   ? $(tpSelector('#divPS2_OBSFOR')).show()                        : $(tpSelector('#divPS2_OBSFOR')).hide();
    scmFichaPrePedido.habilitaCampoLocal == 'S'             ? $(tpSelector('#divLocal')).show()                             : $(tpSelector('#divLocal')).hide();
    scmFichaPrePedido.habilitaCampoSolicitacaoCompra =='S'  ? $(tpSelector('#divPS2_IDPSN')).show()                         : $(tpSelector('#divPS2_IDPSN')).hide();
    scmFichaPrePedido.habilitaContingencia == 'S'           ? $(tpSelector('#divContingencia')).show()                      : $(tpSelector('#divContingencia')).hide()
    

    if(scmFichaPrePedido.habilitaMensagemPedido == 'N'){
        $(tpSelector('#divPS2_IDPSM')).hide(); 
    }
    
    if (scmFichaPrePedido.habilitaComexImportacao == 'S' ){
        $(tpSelector('#divComex')).show()
        scmFichaPrePedido_initDdlComex()
    }else{
        $(tpSelector('#divComex')).hide()
    }

    if (scmFichaPrePedido.habilitaCampoOrcamento){
        $(tpSelector('#campoOrcamento')).css('display', 'block')
        scmFichaPrePedido_iniDdlOrcamento()
    }else{
        $(tpSelector('#campoOrcamento')).css('display', 'none');
    } 
    
    
    if (scmFichaPrePedido.habilitaCampoSolicitacaoCompra =='S'){
        $(tpSelector('#divPS2_IDPSN')).show()
        scmFichaPrePedido_initDdlPS2_IDPSN()
    }else{ 
        $(tpSelector('#divPS2_IDPSN')).hide();
    }
    
    if( scmFichaPrePedido.habilitaIncluirAprovadores == 'N' ){
        $(tpSelector('#divPS2_APRVCP')).hide()
    }
    
    // centro de custo
    if(scmFichaPrePedido.habilitaCentroCusto == 'S') {
        $(tpSelector('#divPS2_CC')).show();
        scmFichaPrePedido_initDdlCentroCusto(scmFichaPrePedido.objSolicitante.PSH_CC);
    } else {
        $(tpSelector('#divPS2_CC')).hide();        
    }
    
    //campos verba 
    if(scmFichaPrePedido.habilitaCamposVerba =='S'  ){
        $( tpSelector('#buscaOrcamento') ).show() 
        $( tpSelector('#campoVerba') ).show()
    }else{
        $( tpSelector('#buscaOrcamento') ).hide()
        $( tpSelector('#campoVerba') ).hide()
    }
    
     // classe de valor
    if(scmFichaPrePedido.habilitaClasseValor == 'S') {
        $(tpSelector('#divPS2_CLVL')).show();  
        scmFichaPrePedido_initDdlClasseValor(scmFichaPrePedido.objSolicitante.PSH_MCLVL)
    } else {
        $(tpSelector('#divPS2_CLVL')).hide();                
    }
    
    if(scmFichaPrePedido.habilitaContaContabil == 'S') {
        $(tpSelector('#divPS2_CONTA')).show();
        scmFichaPrePedido_initDdlContaContabil()
    } else {
        $(tpSelector('#divPS2_CONTA')).hide();                
    }
    
     // item contabil
    if(scmFichaPrePedido.habilitaItContabil == 'S') {
        $(tpSelector('#divPS2_ITEMCT')).show();
        scmFichaPrePedido_initDdlItemContabil()
    } else {
        $(tpSelector('#divPS2_ITEMCT')).hide();                
    }
    
    //Planilha e Conta Orçamentária
    if(scmFichaPrePedido.habilitaPCO == 'S') {
        $(tpSelector('#DivPCO')).show();
        scmFichaPrePedido_initDdlPlanOrc();
        scmFichaPrePedido_initDdlContaOrc();
        $(tpSelector('#btnVldOrc')).show();
    } else {
      $(tpSelector('#DivPCO')).hide();  
      $(tpSelector('#btnVldOrc')).hide();
    }
    
    if(scmFichaPrePedido.habilitaDescricaoSubst == 'S') {
        $(tpSelector('#DivSubDesc')).removeClass('hide');
    }
    
    if ( scmFichaPrePedido.habilitaNatureza == 'S'){
        $(tpSelector('#divNatureza')).show();
        scmFichaPrePedido_initDdlNatureza();
    }else{
        $(tpSelector('#divNatureza')).hide();                
    }
    
    if (scmFichaPrePedido.habilitaEntObra == 'S'){
        $(tpSelector('#divEntObra')).show();
    }else{
        $(tpSelector('#divEntObra')).hide();
    }
    
    if(scmFichaPrePedido.habilitaGrpAprova == "S"){
        $(tpSelector('#divGrpAprovador')).show();        
    }else{
        $(tpSelector('#divGrpAprovador')).hide();        
    }
    
    if ( scmFichaPrePedido.habilitaTabelaPreco != "S"){
        $(tpSelector('#btnBuscaPreco')).attr("disabled", true);
    }
    
    if ( scmFichaPrePedido.habilitaDataEmissao == 'N' ){
        $(tpSelector('#txtEmissao')).attr("disabled", true);
    }
    
    if ( getTetrisParams('SCM_HABILITA_CENTRAL_FORNECEDOR','SCM') == 'N' ){
        $(tpSelector("#divTipoFollowUp")).hide();
    }else{
        $(tpSelector("#divTipoFollowUp")).show();
        scmFichaPrePedido_initDdlTipoFollowUp()
    }
    
    if ( scmFichaPrePedido.habilitaCampoOrdemProd == 'S' ){
        $(tpSelector('#divPS2_OP')).show();        
    } else {
        $(tpSelector('#divPS2_OP')).hide();        
    }
    
    if ( scmFichaPrePedido.habilitaAnexo == 'S'){
        $(tpSelector('#divAnexo')).show();        
    } else {
        $(tpSelector('#divAnexo')).hide();        
    }
    
    // INCLUSÃO E EDIÇÃO DO FORNECEDOR 
     if(scmFichaPrePedido.habilitaIclusaoEdicaoFornecedorFicha == 'S') {
         $(tpSelector('#ddlFornecedorEditar')).show();  
        $(tpSelector('#ddlFornecedorAdicionar')).show();  
    } else {
        $(tpSelector('#ddlFornecedorEditar')).hide();
        $(tpSelector('#ddlFornecedorAdicionar')).hide();
    }
    
    // inclusão de produto e edição
     if(getTetrisParams('HABILITA_INCLUSAO_PRODUTO_FICHA_PRE_SOLICITACAO_CO','SCM') == 'S') {
         $(tpSelector('#DivIncluirProduto')).show();  
         $(tpSelector('#editarPs9')).show();  

    } else {
        $(tpSelector('#DivIncluirProduto')).hide(); 
        $(tpSelector('#editarPs9')).hide();
        
    }
    
    if(getTetrisParams('HABILITA_INCLUSAO_FORNECEDOR_PRE_PEDIDO_E_SOL_PAG','SCM') == 'S') {
        $(tpSelector('#editarPs9_forn')).show(); 
        $(tpSelector('#divBtnIncluirF')).show(); 
    } else {
        $(tpSelector('#editarPs9_forn')).hide(); 
        $(tpSelector('#divBtnIncluirF')).hide();
    }
    
    if (getTetrisParams('SCM_DEFINE_MESMA_PRIORIDADE_ITENS_SC', 'SCM') == 'S'){
	    $(tpSelector("#divPrioridadeCab")).show();
	    $(tpSelector("#divPrioridadeItem")).hide();
    }else{
        $(tpSelector("#divPrioridadeCab")).hide();
	    $(tpSelector("#divPrioridadeItem")).show();
    }
    
	if( scmFichaPrePedido.habilitaBaseImposto == "S"){
        $(tpSelector("divBaseImposto")).hide()
    }else{
        $(tpSelector("divBaseImposto")).show()
    }
    
	if( scmFichaPrePedido.defineEnvioAutomatico == "S"){
        tpSetVal('PS2_ENVPED', 'S');
        tpSetVal('PS2_COPCOM', 'S');
        tpSetVal('PS2_COPSOL', 'S');
    }else if( scmFichaPrePedido.defineEnvioAutomatico == "N") {
        tpSetVal('PS2_ENVPED', 'N');
        tpSetVal('PS2_COPCOM', 'N');
        tpSetVal('PS2_COPSOL', 'N');
        
        tpDisable('PS2_COPCOM');
        tpDisable('PS2_COPSOL');
    }
	
    tpSetVal('PS2_AVISO', 'S');

    if( scmFichaPrePedido.habilitaCampoAutFat == "S"){
        $(tpSelector('#divPS2_AVISO')).show()
    }else{
        $(tpSelector('#divPS2_AVISO')).hide()
    }
    
    if( usuarioLogado.objComprador.Y1_ACESSO == "N"){
        tpDisable('#ddlComprador')
    }else{
        tpEnable('#ddlComprador')
    }
    
    if( getTetrisParams('HABILITAR_DESCRICAO_COMPLEMENTAR_MEMO','SCM') ) {
        $(tpSelector('#txtObs')).parent().parent().hide();  
        $(tpSelector('#txtObservacaoMemo')).parent().parent().show();  
    } else {
        $(tpSelector('#txtObs')).parent().parent().show();  
        $(tpSelector('#txtObservacaoMemo')).parent().parent().hide();  
    }
    
    if(getTetrisParams('HABILITA_LOCAL_FATURAMENTO','SCM') != 'S'){
        $(tpSelector("#divLocalFaturamento")).hide();
    }
   
    scmFichaPrePedido_initDdlEspecie('')
    scmFichaPrePedido_initDdlCondPagamento()
    scmFichaPrePedido_initDdlGrupoProduto()
    
    if (scmFichaPrePedido.opcoesModalidade != 'T'){
        if (scmFichaPrePedido.opcoesModalidade == 'A'){
            cOption = `<option value="A" id='optContPar'>Contrato de Parceria</option>`
        }else{
            cOption = `<option value="C" id='optContGCT'>Contrato GCT</option>`
        }
    }else{
        cOption = `<option value="A" id='optContPar'>Contrato de Parceria</option>`
        cOption += `<option value="C" id='optContGCT'>Contrato GCT</option>`
    }
    
    $(tpSelector('#PS2_MODALI')).append(cOption);
    if(scmFichaPrePedido.SCM_HABILITA_API_WEBPOSTO == "S"){
        
        $('#divFormaPag').show();
        $('#divKm').show();
        $('#divHorimetro').show();
        
        scmFichaPrePedido_initDdlFormaPagamento();
    }
    
    /*CAMPOS PARAMETRIZADOS SAP B1*/
    if(scmFichaPrePedido.integraAPISAP == "S"){
        
        if(scmFichaPrePedido.parametroIntegracaoAPISAP.HABILITA_FORMA_PAGAMENTO == "S"){
            
            $('#divFormaPag').show();
            scmFichaPrePedido_initDdlFormaPagamento();        
        }
    }
    
    if(scmFichaPrePedido.habilitaResponsaveis == "S"){
        $(tpSelector("#divPS2_RESPON")).show();
        scmFichaPrePedido_ddlResponsaveis("")
    }
    
    if(scmFichaPrePedido.habilitaInfGeraisEReqTec == "S"){
        $(tpSelector("#divPS2_XINFGE")).show();
        $(tpSelector("#divPS2_XRETEC")).show();
    }

    if(scmFichaPrePedido.habilitaPlacaChassi == 'S'){
        $(tpSelector('#divPS2_XPLACA')).show();  
    }
    
    if(scmFichaPrePedido.habilitaUMCadastrada == "S" ) {
        let divUnidMedida = $('#txtUnidade').parent();
        $('#txtUnidade').remove()
        divUnidMedida.append(`<select id="txtUnidade" name="txtUnidade" class="form-control param"></select>`)
        
        scmFichaPrePedido_initDdlUnidade()
    }
    
    scmFichaPrePedido_initDllAprovadores();
    scmFichaPrePedido_ddlTransportadora();
	if(scmFichaPrePedido.habilitaRegraTipoSC == 'S') {
	   $($(tpSelector('#ddlComprador')).parent().parent()).after($(tpSelector('#divPS2_IDPSN')));
	   $($(tpSelector('#DivAprov'))).hide();
	   //$($(tpSelector('#divPS2_IDPSN'))).css('padding-left', '0');
	}

    $('#divLocalFaturamento label.control-label').text(scmFichaPrePedido.nomeLocalFat);
}



function scmFichaPrePedido_alterar_produto(){
     var produto = $(tpSelector('#ddlProdutos')).select2('data');
     
     if( empty(produto)){
        toastr.warning('Necessário escolher um produto');
    }else{
        var produtoLoja = produto.id
        var arrayprodutor =  produtoLoja.split('/',6)
        var codigo = arrayprodutor[0]
     
    TPnavpop('scmFichaProdutos.html', `scmFichaProdutos_init('A','${codigo}')`,'95%');
    }
}


function scmFichaPrePedido_init(codNum, codPedidoPai) {
    scmFichaPrePedido.aData = [];
    scmFichaPrePedido.EMPFIL_ADHOC = tpGetEmpFil()
    scmFichaPrePedido.defineDtLancamento = scmCore_retornaValorParametro('SCM_DEFINE_DT_LIBERA_LANCAMENTO_PD_SP') || '01/01/2000'

    $($(tpSelector('#ddlComprador')).siblings()[0]).text(getTetrisParams('ENTIDADE_COMPRADOR'))
    
    $(tpSelector('#PS2_ANXXML')).val('').TPAnexo('',  {acceptFileTypes		: 'xml', btnLabel: 'XML NFe'});

    scmFichaPrePedido.objSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());    
    scmFichaPrePedido.resetItem();
    
    scmFichaPrePedido.resetPrePed();
    scmFichaPrePedido_carregaMoedas(scmFichaPrePedido.moedaDefault);
    scmFichaPrePedido_animateOpenDivItemPrePedido();
    //scmFichaPrePedido_renderStatusPrePedido();
    let infoSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
    tpSetVal('#ddlSolicitante', infoSolicitante.PSH_ID, infoSolicitante.PSH_NOME)
	
	if(getTetrisParams("SCM_OCULTA_IMPOSTOS_FICHA_PREPEDIDO_ITEM") == 'S'){
        $(tpSelector('#txtIPI')).parent().parent().hide();
        $(tpSelector('#txtValorIPI')).parent().parent().hide();
        $(tpSelector('#txtValorICMSST')).parent().parent().hide();
        $(tpSelector('#txtValorDifal')).parent().parent().hide();
        $(tpSelector('#txtBaseICMS')).parent().parent().hide();
        $(tpSelector('#txtICMS')).parent().parent().hide();
        $(tpSelector('#txtValorICMS')).parent().parent().hide();
        $(tpSelector('#txtBasePIS')).parent().parent().hide();
        $(tpSelector('#txtPIS')).parent().parent().hide();
        $(tpSelector('#txtValorPIS')).parent().parent().hide();
        $(tpSelector('#txtBaseCOF')).parent().parent().hide();
        $(tpSelector('#txtCOF')).parent().parent().hide();
        $(tpSelector('#txtValorCOF')).parent().parent().hide();
    }
	
    if(getTetrisParams("SCM_OCULTA_SOLICITANTE_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#ddlSolicitante')).parent().parent().css('display', 'none');
    }
    
    if(getTetrisParams("SCM_HABILITA_TES_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#divTES')).attr('hidden', false);
    }
    
    if(getTetrisParams("SCM_OCULTA_EMAIL_E_CONTATO_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#txtContato')).parent().parent().css('display', 'none');
        $(tpSelector('#txtEmail')).parent().parent().css('display', 'none');
    }
  
    if(getTetrisParams("SCM_HABILITA_IMPOSTOS_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#divIMPOSTOS')).css('display', 'block');
    }
    
    //VERIFICA SE ORÇAMENTO É DO TIPO POR PERIODO
    if( getTetrisParams("SCM_HABILITA_ORCAMENTO_POR_PERIODO") == 'S' ){
        $(tpSelector("#buscaOrcamento")).attr("hidden", true);
    }
    
    //TRATATIVA DE DECIMAIS DA QUANTIDADE
    $(tpSelector('#txtQtde')).unmask()
    $(tpSelector('#txtQtde')).removeClass('VALOR');
    $(tpSelector('#txtQtde')).removeClass('VALOR1');
    $(tpSelector('#txtQtde')).removeClass('VALOR2');
    $(tpSelector('#txtQtde')).removeClass('VALOR3');
    $(tpSelector('#txtQtde')).removeClass('VALOR4');
    $(tpSelector('#txtQtde')).removeClass('VALOR5');
    $(tpSelector('#txtQtde')).removeClass('VALOR6');
    $(tpSelector('#txtQtde')).removeAttr('tpmask');
    $(tpSelector('#txtQtde')).addClass('VALOR' + formatNumber(getTetrisParams('SCM_DECIMAL_QUANTIDADE', 'SCM'),0));
    allPages();
    
    if(getTetrisParams('SCM_HABILITA_RATEIO', 'SCM') == 'S') {
        if(getTetrisParams('SCM_EXIBE_RATEIO_GERAL', 'SCM') == 'S') {
            $(tpSelector('#divBtnRateioGeral')).attr('hidden', false);
        }else{
            $(tpSelector('#rateioCC')).attr('hidden', false);
            $(tpSelector('#rateioConta')).attr('hidden', false);
            $(tpSelector('#rateioItemConta')).attr('hidden', false);
            $(tpSelector('#rateioClasseValor')).attr('hidden', false);
        }
        scmFichaPrePedido.dados_rateio_cc           = [];
        scmFichaPrePedido.dados_rateio_conta        = [];
        scmFichaPrePedido.dados_rateio_item_conta   = [];
        scmFichaPrePedido.dados_rateio_classe_valor = [];
        scmFichaPrePedido.dados_rateio_geral        = [];
    }
    
    if(getTetrisParams('SCM_HABILITA_RATEIO_PCO', 'SCM') == 'S') {
        $(tpSelector('#rateioPCO')).show();
        scmFichaPrePedido.dados_rateio_pco = [];
    }
    
	//$('.VALOR_MASK').inputmask({ 'alias': 'decimal', 'radixPoint': ',', 'groupSeparator': '.', 'digits': getTetrisParams('VALOR_MASK'), 'digitsOptional': false, 'autoGroup': true, 'placeholder': '0' });
	
	$(tpSelector('#ddlTipoFollowUp')).select2();
	$(tpSelector('#PS2_IDPSM')).select2();
	$(tpSelector('#btnNovoItem')).hide();
	$(tpSelector('#btnAdicionarItem')).show();
	$(tpSelector('#btnsEdicao')).hide();
    $(tpSelector('#ddlEmitente')).attr("disabled", true);
    $(tpSelector('#ddlEmitente')).val(usuarioLogado.codigoUsuario());
	$(tpSelector('#ddlEmitente')).attr('tpcallback',"$(tpSelector('#ddlEmitente')).val('"+usuarioLogado.codigoUsuario()+"');");
	tpSetVal('#ddlEntObra',"2");//default
	
	$(tpSelector('#labelCTD')).html(scmCore_nomeEntidade('CTD'));
    $(tpSelector('#labelCTH')).html(scmCore_nomeEntidade('CTH')); 
    $(tpSelector('#labelCTT')).html(scmCore_nomeEntidade('CTT'));
    $(tpSelector('#labelAK1')).html(scmCore_nomeEntidade('AK1'));
    $(tpSelector('#labelAK3')).html(scmCore_nomeEntidade('AK3'));
    
    if ( !empty(scmFichaPrePedido.nomeLocalEntrega) ) {
        $(tpSelector('#labelLocalEnt')).html(scmFichaPrePedido.nomeLocalEntrega);
    }
	
	var codComprador = usuarioLogado.comprador();
    
    $(tpSelector('#campoAprovador')).hide();
    if(strIsVoid(codComprador)){
        codComprador = "";
    }
    
    $(tpSelector('#txtDtEntrega')).val(moment().format('DD/MM/YYYY'));
    $(tpSelector('#txtEmissao')).val(moment().format('DD/MM/YYYY'));
    
    setSelect(tpSelector("#ddlComprador"), codComprador.trim());
	scmFichaPrePedido_habilitaCamposParametrizados();
    scmFichaPrePedido.objSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
	scmFichaPrePedido_initDdlCentroCusto(scmFichaPrePedido.objSolicitante.PSH_CC);
	
	if(scmFichaPrePedido.habilitaCampoLocal == 'S') {
        scmFichaPrePedido_ddlLocal();
    }
	
	if ( scmFichaPrePedido.habilitaAdiantamento == 'S'){
	    $(tpSelector('#divAdiantamento')).show();
	} else {
        $(tpSelector('#divAdiantamento')).hide();	 
	}
	
	/*
	if(scmFichaPrePedido.habilitaCamposProjeto){
		scmFichaPrePedido_initDdlProjeto(scmFichaPrePedido.objSolicitante.PSH_CC);
		scmFichaPrePedido_initDdlRevisao();
		scmFichaPrePedido_initDdlTarefa();
	}*/
	if(scmFichaPrePedido.habilitaProjeto == 'S'){
	    scmFichaPrePedido_initDdlProjeto(scmFichaPrePedido.objSolicitante.PSH_CC);
	}	    
	if(scmFichaPrePedido.habilitaCampoRevisao == 'S'){
	    scmFichaPrePedido_initDdlRevisao();
	}
	
	if(scmFichaPrePedido.habilitaCampoTarefa == 'S'){
	    scmFichaPrePedido_initDdlTarefa();
	}
	
	
	if(scmFichaPrePedido.habilitaEdicapUnidadeMedida == 'N'){
        $(tpSelector('#txtUnidade')).attr('disabled', true);
	}
	
	
	if(scmFichaPrePedido.habilitaGrpAprova == "S"){
        //scmFichaPrePedido_initddlGrpAprov();
        scmFichaPrePedido_ddlGrupoAprovacao();
	}
	
	if(scmFichaPrePedido.habilitaCampoOrdemProd == 'S'){
	    scmFichaPrePedido_ddlOP();
	}
	
	//scmFichaPrePedido_initDdlLocalEntrega(scmFichaPrePedido.objSolicitante.PSH_FILENT);
	scmFichaPrePedido_posicionaDadosSolicitante();
    scmFichaPrePedido_ddlProdutos();
    scmFichaPrePedido_ddlFornecedor();
	scmFichaPrePedido_setCodPai(codPedidoPai);
	scmFichaPrePedido_utilitarios();
	scmFichaPrePedido_listaAdiantamento();
	scmFichaPrePedido_carregaIncoterms('');
	
	$(tpSelector('#PS2_MODALI')).select2();
    $(tpSelector('#PS2_UNVIGE')).select2();
    $(tpSelector('#PS2_FLGRES')).select2();
    $(tpSelector('#PS2_ENVPED')).select2();
    $(tpSelector('#PS2_COPCOM')).select2();
    $(tpSelector('#PS2_COPSOL')).select2();
    $(tpSelector('#PS2_AVISO')).select2();
    $(tpSelector('#PS2_FLGCAU')).select2();
    $(tpSelector('#PS2_TPCAU')).select2();
    $(tpSelector('#PS2_PEDTII')).select2();
    tpSetVal('#PS2_MODALI', 'P', 'Pedido de Compra');
    if(getTetrisParams('SCM_EXIBE_CONTRATO_SC_PRE_PEDIDO', 'SCM') == 'S') {
        $(tpSelector('#divPS2_MODALI')).attr('hidden', false);
        $(tpSelector('#divDadosContrato')).attr('hidden', false);
        $(tpSelector('#divItensContrato')).attr('hidden', false);
        $(tpSelector('#divEnviaEmail')).attr('hidden', true);
        
        if (getTetrisParams('SCM_MODALIDADE_PADRAO_SC_PRE_PEDIDO') == "C"){
            tpSetVal('#PS2_MODALI', 'C', 'Contrato');
            $(tpSelector('#divAdiantamento')).attr('hidden', true);
            $(tpSelector('#divDocumentos')).attr('hidden', true);
        }
        
        scmFichaPrePedido_changePS2_MODALI();
    }
    scmFichaPrePedido_ddlEstado( tpSelector('#PS2_UFORIG') )
    scmFichaPrePedido_ddlEstado( tpSelector('#PS2_UFDEST') )
	scmFichaPrePedido_aplicaMaskValor()											
	
	if(!strIsVoid(codNum)){
	    scmFichaPrePedido_get(codNum, '', 'A');
	}
	
	if(getTetrisParams('FIXA_LOCAL_DE_ENTREGA') == "S") {
	    tpSetVal('ddlEntregar', getCookie('EmpFil').substr(2))
	    $(tpSelector('#ddlEntregar')).attr('disabled', true)
	    
	    if(existBlock(typeof scmFichaPrePedidoPE_ddlEntregar)){
            scmFichaPrePedidoPE_ddlEntregar(true);
        }
	}

	$(tpSelector('#PS2_XGESTO')).select2();
	scmFichaPrePedido_ddlGrupoAprovacaoCP();

    // input de contato começa como texto por padrão, então não mostro o select de inicio
	$('#ddlContato').parent().hide();
	$('#divBtnMaisContato').hide();
	
	// Para aumentar tamanho de ddlMoeda e adicionar o cursor pointer
	$('#ddlMoeda').parent().parent().attr('class', 'col col-xs-4 col-md-2');
	$('#ddlMoeda').css('cursor', 'pointer');
	
	if(scmFichaPrePedido.habilitaRegraTipoSC == 'S') {
        if(!empty(codNum)) {
            scmFichaPrePedido.ACAO = "A"
        }else{
            scmFichaPrePedido.ACAO = "I"
            
            setTimeout(function() {
                $(tpSelector('#divItemPrePedido')).hide();
            }, 100);
        }
            
        // if(!empty(tpGetVal('PS2_IDPSN').split('|')[2].trim())) {
        //     scmFichaPrePedido_exibirFormularioNaDiv(tpGetVal('PS2_IDPSN').split('|')[2].trim());
        //     $("#divItemPrePedido").hide();
        //     $("#divItemFormDinamico").show();
            
        //     if(scmFichaPrePedido.ACAO == 'I') {
        //     }
            
        // }else{
        //     $("#divItemFormDinamico").hide();
        //     $("#divItemPrePedido").show();
        // }
	}
	if(existBlock(typeof scmFichaPrePedidoPE_init)){
        scmFichaPrePedidoPE_init();
    }
}

function scmFichaPrePedido_aplicaMask(){
    $(tpSelector('.VALOR_MASK')).inputmask({'alias': 'decimal', 
                                            'radixPoint': ',',
                                            'groupSeparator': '.',
                                            'digits': getTetrisParams('VALOR_MASK'),
                                            'digitsOptional': false,
                                            'autoGroup': true,
                                            'placeholder': '0'});
    
}

function scmFichaPrePedido_aplicMask2(){
   $(tpSelector('.VALOR_MASK2')).inputmask({'alias': 'decimal', 
                                            'radixPoint': ',',
                                            'groupSeparator': '.',
                                            'digits': 2,
                                            'digitsOptional': false,
                                            'autoGroup': true,
                                            'placeholder': '0'});   
}

function scmFichaPrePedido_aplicaMaskQtd(){
    $(tpSelector('.VALOR_MASKQTD')).inputmask({'alias': 'decimal', 
                                            'radixPoint': ',',
                                            'groupSeparator': '.',
                                            'digits': getTetrisParams('SCM_DECIMAL_QUANTIDADE'),
                                            'digitsOptional': false,
                                            'autoGroup': true,
                                            'placeholder': '0'});
    
}

function scmFichaPrePedido_carregaMoedas(cMoeda){
    $(tpSelector('#ddlMoeda')).html('')													
    var cRetMoeda = `<option value="" selected></option>`;
    
    tpParam.ClearParam();
	tpParam.AddParams('CONSULTA'    , 'SCM052');

    var oDados       = tpParam.SendFormPost('WSGETCONS');
    
    if(oDados.errorcode == '00'){
        var aData = ajustaraData(oDados)
        
        for (var xl = 0; xl < aData.length; xl++) {						
            if(!empty(cMoeda.trim()) && cMoeda.trim() == aData[xl].ZT9_COD.trim()){
                cRetMoeda += `<option selected value="${aData[xl].ZT9_COD.trim()}">${aData[xl].ZT9_COD.trim()} - ${aData[xl].ZT9_DESCRI.trim()}</option>`																			   
            }else{
                cRetMoeda += `<option value="${aData[xl].ZT9_COD.trim()}">${aData[xl].ZT9_COD.trim()} - ${aData[xl].ZT9_DESCRI.trim()}</option>`
            }
        }    
    }
    
    $(tpSelector('#ddlMoeda')).append(cRetMoeda)
}

function scmFichaPrePedido_initDdlUnidade() {
           
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'  , 'SCM012');
    
    gv$.form.bindSelect2('#txtUnidade', {
                                            queryID:    'SCM012',
                                            evalValue:  'data.AH_UNIMED',
                                            evalText:   'data.AH_UNIMED + " - " + data.AH_UMRES',
                                            minimumInputLength: 0,
                                            aQueryParams: aParams,
                                            });
    
    $(tpSelector("#txtUnidade")).parent().parent().removeClass("col-md-1").addClass("col-md-2");          
}

function scmFichaPrePedido_utilitarios() {
    if (getTetrisParams('ADD_ITEM_COTACAO') !== 'S') return;
}

function scmFichaPrePedido_setCodPai(codPedidoPai) {

	if (!strIsVoid(codPedidoPai)) {
		$(tpSelector("#hdPedidoPai")).val(codPedidoPai);
		$(tpSelector("#PedidoPai")).html('Pedido Global: ' + codPedidoPai);
		$(tpSelector("#divPedidoPai")).attr('style', 'display:blok');
	}
}

function scmFichaPrePedido_posicionaDadosSolicitante() {

	var solicitante = $(tpSelector("#ddlSolicitante")).val();

	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM035');
	tpParam.AddParams('PSH_ID', solicitante);
	tpParam.AddParams('ZT3_CODIGO', 'ALL');
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

	var oDados = tpParam.SendFormPost('WSGETCONS');

	if (oDados.errorcode == '00') {

		var aData = ajustaraData(oDados);
		var data = aData[0];

		//setSelect('#ddlEntregar', data.PSH_FILENT.trim());

        scmFichaPrePedido_initDdlLocalEntrega('')
		scmFichaPrePedido_ajustarLayout();
	}
}

function scmFichaPrePedido_alterarFornecedor() {
    var ddlFornecedor = $(tpSelector('#ddlFornecedor')).select2('data');
    
    if( empty(ddlFornecedor)){
        toastr.warning('Necessário escolher um Fornecedor');
    }else{
        var fornecedorLoja = ddlFornecedor.id
        var arrayFornecedor =  fornecedorLoja.split('/',6)
        var codigo = arrayFornecedor[0]
        var A2_LOJA =arrayFornecedor[1]
        
        TPnavpop('scmFichaFornecedor.html #conteudo', `scmFichaFornecedor_init('A','${codigo}','${A2_LOJA}')`,'80%');
    }
}

function scmFichaPrePedido_ddlResponsaveis(cValue){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM045'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM045',
        minimumInputLength: 0,
        evalValue: 'data.ZT1_CODIGO.trim()',
        evalText: "data.ZT1_CODIGO.trim()+ ' - ' +data.ZT1_NOME.trim()",
        aQueryParams: paramConsulta,
        selectedValue : cValue,
        multiple: true
    };
    
    gv$.form.bindSelect2('#PS2_RESPON', options);
}


function scmFichaPrePedido_initDdlCentroCusto(solicitanteCC){
    //Transforma os dados de centros de custo do solicitante em uma string com separação por virgula sem espaços    
	
	scmFichaPrePedido.solicitanteCCusto = 'ALL';
    if(solicitanteCC.trim().length > 0){
        var aCC = solicitanteCC.trim().split(';');
        scmFichaPrePedido.solicitanteCCusto = aCC.length > 0 ? aCC.join("','"): aCC[0];
		 
    }
    else {
		scmFichaPrePedido.solicitanteCCusto = 'ALL';
    }

    if (!empty(scmFichaPrePedido.solicitanteCCusto)){
        tpParam.ClearParam();
        tpParam.AddParams('CONSULTA', 'SCM148'); 
    	tpParam.AddParams('CTT_CUSTO', scmFichaPrePedido.solicitanteCCusto);
    	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
        
        var paramConsulta = tpCloneArray(aParams);
        
        options ={
            data64: true,
            queryID: 'SCM148',
            minimumInputLength: 0,
            evalValue: 'data.CTT_CUSTO.trim()',
            evalText: "data.CTT_CUSTO.trim() + ' - ' + data.CTT_DESC01.trim()",
            aQueryParams: paramConsulta,
            multiple: false,
        }
        
        gv$.form.bindSelectQuery('#ddlCentroCusto', options);
    }
}

function scmFichaPrePedido_setValorDdlLinhaNegocio(){
    setSelect(tpSelector('#ddlLinhaNegocio'), scmFichaPrePedido.aCCXLinha[$(tpSelector('#ddlCentroCusto')).val()]);
}

function scmFichaPrePedido_initDdlProjeto(solicitanteCC){
    $(tpSelector('#ddlProjeto')).select2({
		minimumInputLength: 1,
		dropdownAutoWidth: true,
		escapeMarkup: function (m) { return m; },
		query: function (query) {

			tpParam.ClearParam();
			tpParam.AddParams('CONSULTA', 'SCM120');
			tpParam.AddParams('PROJETO', 'ALL');
			tpParam.AddParams('REVISAO', 'ALL');
			tpParam.AddParams('PESQ_PROJ', query.term.toUpperCase());
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
			
			var ddlValue = 's.AF8_PROJET + " - " + s.AF8_REVISA';
			var ddlText = 's.AF8_PROJET + " - " + s.AF8_DESCRI';
			var nomeFuncao = tpGetNomeFuncaoWSGETCONS();

			$.ajax({
				url: tpGetResourceUrl(nomeFuncao),
				dataType: "text",
				async: true,
				data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
				success: function (ajaxData) {

					oDados = GetContentJson(ajaxData);

					if (oDados.errorcode == '00') {
						var ddlData = { results: [] }, i, j, s;
						var aData = ajustaraData(oDados);
						if (parseInt(oDados.totalreg) > 0) {
							$(aData).each(function (index, s) {
								ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
							});
						}
						else {
						    if($(tpSelector('#ddlProjeto')).attr('disabled') !== 'disabled'){
							    ddlData.results.push({ id: '', text: query.term });
						    }
						}
						query.callback(ddlData);
					}
					else {
						console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
					}
				},
				error: function (err) {
					console.log('Nao conformidade solicitacao ajax');
				}
			});
		}
	}).on('change', function (e) {
		scmFichaPrePedido_aplicarSelecaoProjeto();
	}).on('select', function (e) {
		scmFichaPrePedido_aplicarSelecaoProjeto();
	})
    
}

function scmFichaPrePedido_aplicarSelecaoProjeto(){
    var projeto = getSelect2(tpSelector('#ddlProjeto'));
    
    var revisao = projeto.split('-')[1].trim();
    
    scmFichaPrePedido_initDdlRevisao();
    scmFichaPrePedido_initDdlTarefa();
    
    setSelect2(tpSelector('#ddlRevisao'), revisao, revisao);
}

function scmFichaPrePedido_initDdlRevisao(){
    var ddlProjeto = getSelect2(tpSelector('#ddlProjeto'));
    
    $(tpSelector('#ddlRevisao')).select2();
    $(tpSelector('#ddlRevisao')).html('');
    
    if(!strIsVoid(ddlProjeto)){
        var projeto = ddlProjeto.split('-')[0].trim();
        
        tpParam.ClearParam();
    	tpParam.AddParams('CONSULTA', 'SCM120');
    	tpParam.AddParams('PROJETO', projeto);
    	tpParam.AddParams('REVISAO', 'ALL');
    	tpParam.AddParams('CENTROCUSTO', scmFichaPrePedido.solicitanteCCusto);
    	tpParam.AddParams('PESQ_PROJ', '');
		tpParam.AddParams('EMPFIL', getAmbiente().EMPFIL);
		tpParam.AddParams('USUARIO', usuarioLogado.codigoUsuario());
		tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    	
    	tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_ddlRevisaoCallback(data)');
    }
}

function scmFichaPrePedido_ddlRevisaoCallback(oDados){
    if(oDados.errorcode == '00'){
        var aData = ajustaraData(oDados);
        
        $(aData).each(function(index, s){
            $(tpSelector('#ddlRevisao')).append($('<option>', {
                        text: s.AF8_REVISA,
                        value: s.AF8_REVISA
                    }))
        });
    }
}

function scmFichaPrePedido_initDdlTarefa(codTarefa = null){
    var ddlProjeto = getSelect2(tpSelector('#ddlProjeto'));
    
    $(tpSelector('#ddlTarefa')).select2({
        placeholder: '',
        allowClear: true
    });
    $(tpSelector('#ddlTarefa')).html('');
    setSelect2(tpSelector('#ddlTarefa'), '');
    
    if(!strIsVoid(ddlProjeto)){
        
        var projeto = ddlProjeto.split('-')[0].trim();
        var revisao = ddlProjeto.split('-')[1].trim();
    
        tpParam.ClearParam();
    	tpParam.AddParams('CONSULTA', 'SCM122');
    	tpParam.AddParams('AF8_PROJET', projeto);
    	tpParam.AddParams('AF8_REVISA', revisao);
		tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    	
    	tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_ddlTarefaCallback(data, "'+codTarefa+'")');
    }
    else {
        $(tpSelector('#ddlTarefa')).select2("enable", false);
    }
}

function scmFichaPrePedido_ddlTarefaCallback(oDados, codTarefa = null){
    if(oDados.errorcode == '00'){
        $(tpSelector('#ddlTarefa')).html()
        aData = ajustaraData(oDados);
        if(parseInt(oDados.totalreg) > 0){
            $(tpSelector('#ddlTarefa')).select2("enable", true);
            setSelect2(tpSelector('#ddlTarefa'), '');
            $(aData).each(function(index, s){
                $(tpSelector('#ddlTarefa')).append($('<option>', {
                            text: s.AF9_TAREFA + ' - ' + s.AF9_DESCRI,
                            value: s.AF9_TAREFA
                        }))
            });
        }
        
        if(!strIsVoid(codTarefa) && codTarefa !== 'null'){
            setSelect2(tpSelector('#ddlTarefa'), codTarefa);
        }
    }
    else {
        bootbox.alert(oDados.errormsg.replace(/\n/g, '\\n'));
    }
}

function scmFichaPrePedido_ddlFornecedor() {

    var codUserComp = usuarioLogado.codigoUsuario();
	$(tpSelector("#ddlFornecedor")).select2({
		minimumInputLength: 2,
		dropdownAutoWidth: true,
		escapeMarkup: function (m) { return m; },
		query: function (query) {

			tpParam.ClearParam();
			tpParam.AddParams('CONSULTA', 'SCM032');
            tpParam.AddParams('PESQUISA', '%' + query.term + '%');
			tpParam.AddParams('PAGINA', '1');
			tpParam.AddParams('TAMPAG', '20');
			tpParam.AddParams('HEADER', 'N');
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

			var ddlValue = 's.A2_COD + "/" + s.A2_LOJA';
			var ddlText = 's.A2_COD + "/" + s.A2_LOJA + " - " + s.A2_NOME.trim() +" (CNPJ:"+s.A2_CGC+")" + " - UF: " + s.A2_EST + " - MUN: " + s.A2_MUN.trim() ';
			var nomeFuncao = tpGetNomeFuncaoWSGETCONS();

			$.ajax({
				url: tpGetResourceUrl('WSGETCONS'),
				dataType: "text",
				async: true,
				data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
				success: function (ajaxData) {

					oDados = GetContentJson(ajaxData);

					if (oDados.errorcode == '00') {
						var ddlData = { results: [] }, i, j, s;
						var aData = ajustaraData(oDados);
						if(aData.length > 0 && aData[0].A2_COD.length ) {
						    
    						if (parseInt(oDados.totalreg) > 0) {
    							$(aData).each(function (index, s) {
    								ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
    							});
    						}
    						else {
    							ddlData.results.push({ id: '', text: query.term });
    						}
						} else {
                            
                            ddlData.results.push({ id: '', text: query.term + " (Não Cadastrado)" });
                            
                        }
						query.callback(ddlData);
					}
					else {
						console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
					}
				},
				error: function (err) {
					console.log('Nao conformidade solicitacao ajax');
				}
			});
		}
	}).on('change', function (e) {
		scmFichaPrePedido.monitorarAlteracoesCabecalho();
		scmFichaPrePedido_posicionaDadosFornecedor('S');
	}).on('select', function (e) {
		scmFichaPrePedido.monitorarAlteracoesCabecalho();
		//scmFichaPrePedido_posicionaDadosFornecedor();
	})
}

function scmFichaPrePedido_ddlProdutos() {

	var sql = scmCore_replaceAll(getTetrisParams('SCM_EXPRESSAO_SQL_DDL_PRODUTO','SCM').trim(),"’","'")
	//INICIO SELECT 2 DDL PRODUTOS
	$(tpSelector("#ddlProdutos")).select2({
		minimumInputLength: 3,
		dropdownAutoWidth: true,
		escapeMarkup: function (m) { return m; },
		query: function (query) {
			$(tpSelector('#ddlProdutos')).select2('val', '')
            tpParam.ClearParam();
			tpParam.AddParams('CONSULTA', 'SCM021');
            tpParam.AddParams('EXPRESSAOSQL', 'IN:'+sql); 
            tpParam.AddParams('PESQUISA', '%' + query.term + '%');
			tpParam.AddParams('B1_GRUPO', 'ALL' );
			tpParam.AddParams('PAGINA', '1');
			tpParam.AddParams('TAMPAG', '20');
			tpParam.AddParams('HEADER', 'N');
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

			var ddlValue = 's.B1_COD';
			var ddlText = 's.B1_COD + " - " + s.B1_DESC';
			var nomeFuncao = tpGetNomeFuncaoWSGETCONS();

			$.ajax({
				url: tpGetResourceUrl('WSGETCONS'),
				dataType: "text",
				async: true,
				data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
				success: function (ajaxData) {
					oDados = GetContentJson(ajaxData);
					var ddlData = { results: [] }, i, j, s;
					if (oDados.errorcode == '00') {
						var aData = ajustaraData(oDados);
						if (parseInt(oDados.totalreg) > 0) {
							$(aData).each(function (index, s) {
								ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
							})
						}
						else {
							ddlData.results.push({ id: '', text: query.term });
						}
						query.callback(ddlData);
					}
					else {
						console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
					}
				},
				error: function (err) {
					console.log('Nao conformidade solicitacao ajax');
				}
			});
		}
	}).on("select2-selecting", function (e) {
		scmFichaPrePedido_posicionaDadosProduto(e.val);
	});// FIN SELECT 2 DDL PRODUTOS
}

function scmFichaPrePedido_initDdlVerba(){
    
    if(scmFichaPrePedido.habilitaCamposVerba =='S'){
    if(strIsVoid(getSelect2(tpSelector('#ddlCentroCusto')))){
        $(tpSelector("#ddlVerba")).select2();
        $(tpSelector("#ddlVerba")).select2('enable', false);
    }
    else {
        $(tpSelector("#ddlVerba")).select2();
        $(tpSelector('#ddlVerba')).attr('disabled', false);
        $(tpSelector("#ddlVerba")).select2('enable', true);

        tpParam.ClearParam();
        tpParam.AddParams('CONSULTA',    'SCM923');
        tpParam.AddParams('CCUSTO',      getSelect2(tpSelector('#ddlCentroCusto')).trim());
        tpParam.AddParams('DATAATUAL',   moment().format('YYYYMMDD'));
		tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

        tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_initDdlVerbaCallback(oDados)');
    }
        
    }
}

function scmFichaPrePedido_initDdlVerbaCallback(oDados){
    if(oDados.errorcode == '00'){
        var aData = ajustaraData(oDados, true);
        var sOptions = '<option></option>';
        if(aData.length > 0){
            aData.forEach(function(data, index){
                sOptions += `
                    <option value="${data.AK6_CODIGO}">${data.AK6_CODIGO} - ${data.AK6_DESCRI.trim()}</option>
                `;
            })
        }

        $(tpSelector('#ddlVerba')).html(sOptions);
        eval($(tpSelector('#ddlVerba')).attr('tpcallback'));
    }
    else{
        bootbox.alert({
            title: 'Erro WebService',
            message: decodeURIComponent(oDados.errormsg)
        });
    }
}

function scmFichaPrePedido_solicitanteOnchange(){
    scmFichaPrePedido_initDdlLocalEntrega('');
}

function scmFichaPrePedido_initDdlLocalEntrega( cLocal, cDescricao ){
    //Verifica qual o Solicitante Selecionado
    var idSolicitante = tpGetVal('#ddlSolicitante')
    
    tpParam.ClearParam() 
    tpParam.AddParams('CONSULTA', 'SCM487'); //Olha para a Consulta Nova Criado, que já possui o Filtro por Solicitante
    if(getTetrisParams('FIXA_LOCAL_DE_ENTREGA') == 'S'){
        tpParam.AddParams('PSH_ID',  'ALL')
    }
    else{
        tpParam.AddParams('PSH_ID',  !empty(idSolicitante) ? idSolicitante : 'ALL' )
    }
	
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
	
	if(getTetrisParams('FIXA_LOCAL_DE_ENTREGA') !== 'S'){
	    var oDados = tpParam.SendFormPost("WSGETCONS");
        var aData 	= ajustaraData( oDados );
    }
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM487',
        minimumInputLength: 0,
        evalValue: 'data.PS4_COD',
        evalText: `data.PS4_COD.trim() + ' - ' + data.PS4_DESC`,
        aQueryParams: paramConsulta,
        callback: function() {
			if(getTetrisParams('FIXA_LOCAL_DE_ENTREGA') == 'S'){
                tpSetVal('ddlEntregar', tpGetEmpFil().substr(2))
                
			}else{
    			if (!empty(cLocal)){
                    tpSetVal('#ddlEntregar',       cLocal, cLocal.trim() + ' - ' + cDescricao)
                }else{
                    var aPadrao = aData.filter( data => data.PS4_COD == data.PSH_FILENT );
                    if (aPadrao.length > 0){
                        setSelect2(tpSelector('#ddlEntregar'), aPadrao[0].PSH_FILENT, aPadrao[0].PSH_FILENT.trim() + ' - ' + aPadrao[0].PS4_DESC)
                    }
                }
			}
        }
    }
    gv$.form.bindSelect2(tpSelector('#ddlEntregar'), options);
    
}


function scmFichaPrePedido_itens_createGrid(codPre, callback = '') {
    showLoader();
    
	if (new RegExp('^[0-9]{6}$').test(codPre)) {
		callIfChange('scmFichaPrePedido.monitorarAlteracoesCabecalho()');
	}

	$(tpSelector("#txtNumPrePedido")).val(codPre);
	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM017');
	tpParam.AddParams('PS2_NUM', codPre);
	tpParam.AddParams('PS2_ITEM', 'ALL');
	
    tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
	if(scmFichaPrePedido.habilitaRegraTipoSC == "S") {
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: , MEMO(PS2_RESPF) AS PS2_RESPF, PSN_FORM, PSN_GRUPO');
    }else{
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: ');
    }
	if(existBlock(typeof scmFichaPrePedidoPE_itens_camposCustom)){
	    scmFichaPrePedidoPE_itens_camposCustom();
	}

	var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_itens_createGridCallback(data, \'' + callback + '\')');
}

function scmFichaPrePedido_itens_createGridCallback(oDados, callback) {
    try {
    	if (oDados.errorcode == "00") {
    	    
    		scmFichaPrePedido.persistir(oDados);
    		var aData = ajustaraData(oDados);
    		
    		$(tpSelector('#btnFinalizar')).show();
    		
    		/*debugger;
    		var nTotalImpostos = 0;
    		var nTotalProdutos = 0;
    		var nTotalGeral = 0;
    		var aData = ajustaraData(oDados);
    		for (var i = 0; i < aData.length; i++) {
    		    nTotalProdutos += parseFloat(aData[i].PS2_TOTAL) 
    		    nTotalImpostos += parseFloat(aData[i].PS2_VALIPI) +  parseFloat(aData[i].PS2_ICMST) +  parseFloat(aData[i].PS2_ICMDA)
    		    nTotalGeral += parseFloat(aData[i].PS2_TOTAL) + parseFloat(aData[i].PS2_VALIPI) +  parseFloat(aData[i].PS2_ICMST) +  parseFloat(aData[i].PS2_ICMDA)
    		}
    		tpSetVal('#txtTotalProdutos', formatNumber(nTotalProdutos,2));
    		tpSetVal('#txtTotalImpostos', formatNumber(nTotalImpostos,2));
    		tpSetVal('#txtTotalGeral', formatNumber(nTotalGeral,2));
    		
    		*/
    		scmFichaPrePedido_somaTotais();
    		
    		JSTPGrid.BindJDatatable('scmFichaPrePedido_itens', oDados, 'scmFichaPrePedido_itens_colunas(oDados)', 'scmFichaPrePedido_itens_getOTableTools()', false, false, false, false);
																														 
    		ajustarColunas('scmFichaPrePedido_itens', ['5%', '25%', '7%', '15%', '7%', '7%', '7%', '7%', '7%', '7%', '1%']);
																													   
    		TetrisDefaultMaskAll();

    		if(callback){
    		    eval(callback);
    		}
    		$(tpSelector('.valor_mask')).inputmask({'alias': 'decimal', 
                                            'radixPoint': ',',
                                            'groupSeparator': '.',
                                            'digits': getTetrisParams('VALOR_MASK'),
                                            'digitsOptional': false,
                                            'autoGroup': true,
                                            'placeholder': '0'});
                                            
    		$(tpSelector('.valor_mask_qtd')).inputmask({'alias': 'decimal', 
                                            'radixPoint': ',',
                                            'groupSeparator': '.',
                                            'digits': getTetrisParams('SCM_DECIMAL_QUANTIDADE'),
                                            'digitsOptional': false,
                                            'autoGroup': true,
                                            'placeholder': '0'});
                                            
            $(tpSelector('.valor_mask_total')).inputmask({'alias': 'decimal', 
                                            'radixPoint': ',',
                                            'groupSeparator': '.',
                                            'digits': 2,
                                            'digitsOptional': false,
                                            'autoGroup': true,
                                            'placeholder': '0'});   
            
            var objSoli = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
    
            var solicitanteCC   = objSoli.PSH_CC;
        
            var solicitanteCCusto;
            if(solicitanteCC.trim().length > 0){
                var aCC = solicitanteCC.trim().split(';');
                solicitanteCCusto = aCC.length > 0 ? aCC.join("','"): aCC[0];
            }
            else {
                solicitanteCCusto = 'ALL';
            }
            
    	    $(aData).each(function () {
    	        var aEmpFil = {
                    PARAMETRO : 'EMPFIL_ADHOC', 
                    VALOR : scmFichaPrePedido.EMPFIL_ADHOC,
                }
    	        
    	        if(getTetrisParams('EXIBE_CC', 'SCM') == 'S'){
                    let params = [
                        {
                            PARAMETRO: 'CTT_CUSTO',
                            VALOR: solicitanteCCusto
                        },
                        {
                            PARAMETRO: 'PESQUISA',
                            VALOR: tpGetVal(`#ddlCentroCusto_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`)
                        },
                        aEmpFil
                    ]
                    
                    scmCore_ddlGener( `#ddlCentroCusto_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`, 'SCM148', 's.CTT_CUSTO', 's.CTT_CUSTO + " - " + s.CTT_DESC01', '', params, "Centro de Custo", true, 1);
    	        }    
                
                if(getTetrisParams('EXIBE_CONTA_CONTABIL', 'SCM') == 'S'){
					scmCore_ddlGener( `ddlContaContabil_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`     , 'SCM522'  , 's.CT1_CONTA '    , 's.CT1_CONTA + " - " + s.CT1_DESC01', '' , [aEmpFil]    ,"Conta Contabil", true, 1); 
                }
                
                var solicitanteClvl = objSoli.PSH_MCLVL;
                var solicitanteCValor;
                if(solicitanteClvl.trim().length > 0){
                    var aClvl = solicitanteClvl.trim().split(';');
                    solicitanteCValor = aClvl.length > 0 ? aClvl.join("','"): aClvl[0];
                }
                else {
                    solicitanteCValor = 'ALL';
                }
                
                if(getTetrisParams('EXIBE_CLVL', 'SCM') == 'S'){
                    let paramsClvl = [
                        {
                            PARAMETRO: 'CTH_CLVL',
                            VALOR: solicitanteCValor
                        },
                        {
                            PARAMETRO: 'PESQUISA',
                            VALOR: tpGetVal(`#ddlSeletorCLVL_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`)
                        },
                        aEmpFil
                    ]
                    
                    scmCore_ddlGener( `ddlSeletorCLVL_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`       , 'SCM937'  , 's.CTH_CLVL '     , 's.CTH_CLVL + " - " + s.CTH_DESC01', '' , paramsClvl    ,"Classe de Valor", true, 1); 
                }
                   
                if(getTetrisParams('EXIBE_IT_CONTABIL', 'SCM') == 'S'){
                   scmCore_ddlGener( `ddlSeletorITCONTA_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`    , 'SCM524'  , 's.CTD_ITEM '     , 's.CTD_ITEM + " - " + s.CTD_DESC01', '' , [aEmpFil]    ,"Item Contabil", true, 1); 
                }   
                
                if(getTetrisParams('EXIBE_PCO', 'SCM') == 'S'){
                    if(getTetrisParams("SCM_MODIFICA_BUSCA_VERBA") == 'AK2'){
                        var cQuery      = 'SCM436';
                        var params      = [];
                        var evalText    =  "s.AK2_CO + ' - ' + s.AK5_DESCRI.trim()";
                        
                        if(scmFichaPrePedido.habilitaFiltroCOCC == "S" || scmFichaPrePedido.habilitaFiltroCOLE == 'S'){
                            cQuery  = 'SCM135'
                            var cCC = 'ALL'
                            var cLE = 'ALL'
                            
                            if(scmFichaPrePedido.habilitaFiltroCOCC == "S"){
                                cCC     = scmFichaPrePedido.habilitaDescEntCont == 'S' ? 
                                            $(tpSelector(`#idlinkCC_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`)).data('codent') : 
                                                $(tpSelector(`#idlinkCC_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`)).html();
                            }
                                
                            if(scmFichaPrePedido.habilitaFiltroCOLE == "S"){
                                cLE      = this.PS2_FILENT.trim();
                            }
                                            
                            params.push(
                                {
                                    PARAMETRO: 'PESQUISA',
                                    VALOR: '%%'
                                },
                                {
                                    PARAMETRO: 'CENTRO',
                                    VALOR: cCC
                                },
                                {
                                    PARAMETRO: 'LOCAL_ENT',
                                    VALOR: cLE
                                }
                            )   
                        }
                        
                        params.push({
                            PARAMETRO: 'ORCAMENTO',
                            VALOR: this.PS2_CODPLA
                        })
                        
                        scmCore_ddlGener( `ddlSeletorCO_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`        , cQuery     , 's.AK2_CO '       , evalText                                                  ,'' , params    ,"Conta Orçamentaria", true, 1);
                        scmCore_ddlGener( `ddlSeletorPO_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`        , 'SCM454'   , 's.AK1_CODIGO '   , 's.AK1_CODIGO + " - " + s.AK1_DESCRI'                     ,'' , [aEmpFil]    ,"Planilha Orçamentaria", true, 1);
                    }
                    else {
                        
                        let params = [
                            {
                                PARAMETRO: 'CODPLA',
                                VALOR: this.PS2_CODPLA
                            },
                            aEmpFil
                        ]

                        scmCore_ddlGener( `ddlSeletorCO_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`        , 'SCM453'  , 's.AK3_CO '       , 's.AK3_CO + " - " + s.AK3_DESCRI'                         ,'' , params    ,"Conta Orçamentaria", true, 1);
                        scmCore_ddlGener( `ddlSeletorPO_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`        , 'SCM234'  , 's.AK1_CODIGO '   , 's.AK1_CODIGO + " - " + s.AK1_DESCRI'                     ,'' , [aEmpFil]    ,"Planilha Orçamentaria", true, 1);
                    }
                    
                }    
                
                if(getTetrisParams('SCM_HABILITA_ORDEM_PRODUCAO', 'SCM') == 'S'){
                   scmCore_ddlGener( `ddlSeletorOP_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`        , 'SCM285'  , 's.OP + "-" + s.C2_PRODUTO + "-" + s.B1_DESC ', 's.OP + " - " + s.C2_PRODUTO + " - " + s.B1_DESC'  ,'' , [aEmpFil]   ,"Ordem de Produção"); 
                }
                
                scmCore_ddlGener( `ddlSeletorProd_${tpConvert.encodeObj(this.PS2_NUM+this.PS2_ITEM)}`        , 'SCM455'  , 's.B1_COD + "_" + s.B1_DESC', 's.B1_COD + " - " + s.B1_DESC'  ,'' , [aEmpFil]   ,"Produto");
            });
			if(tpGetVal('PS2_MODALI') == 'A') {
    			scmFichaPrePedido_createGridItensContrato();
    		}
			if(existBlock(typeof scmFichaPrePedidoPE_itens_createGridCallback)){
               scmFichaPrePedidoPE_itens_createGridCallback(aData);
        	}
    		
    	}
    	else {
    	    bootbox.alert(oDados.errormsg);
    	}
    	scmFichaPrePedido_atualizaTotal();
    }
    catch(err){
        consoleLog(err, 'cyan', 'black');
    }

	if(!empty(scmFichaPrePedido.idUltimoItemAlterado)){
	    if(document.getElementById(scmFichaPrePedido.idUltimoItemAlterado)  != null){ 
	        document.getElementById(scmFichaPrePedido.idUltimoItemAlterado).scrollIntoView({ behavior: "auto", block: "center" });
	    }     
	}

	hideLoader();
}

function scmFichaPrePedido_itens_colunas(oDados) {

    var aColunas = [];
    
	aColunas.push( { "title": "Item",              "data": null,                                       "sClass": "details-control",    "render": function (data, type, full, meta) { return scmFichaPrePedido_itens_prePredidoItem(data, type, full, meta); } } )
    aColunas.push( { "title": "Produto/Serviço",   "data": null,               "tipoDado": "C",        "sClass": "text-left",          "render": function (data, type, full, meta) { return scmFichaPrePedido_itens_produtoServico(data, type, full, meta); } } )
	aColunas.push( { "title": "Entrega",           "data": "PS2_DTENTR",       "tipoDado": "D",        "sClass": "text-center",          "render": function (data, type, full, meta) { return scmFichaPrePedido_itens_entrega(data, type, full, meta); } } )
	aColunas.push( { "title": "Classif.",          "data": null,        		"tipoDado": "C",        "sClass": "text-left",          "render": function (data, type, full, meta) { return scmFichaPrePedido_itens_classificacao(data, type, full, meta); } } )
	
	if (getTetrisParams('SCM_DEFINE_MESMA_PRIORIDADE_ITENS_SC', 'SCM') !== 'S'){
	    aColunas.push( { "title": "Prioridade",        "data": "PS2_PRZA",         "tipoDado": "C",        "sClass": "text-center",         "render": function (data, type, full, meta) { return scmFichaPrePedido_formataPrioridade(data, type, full, meta); } } )
	}
	
	aColunas.push( { "title": "Quant",             "data": "PS2_QUANT",        "tipoDado": "N",        "sClass": "text-right",         "render": function (data, type, full, meta) { return scmFichaPrePedido_formataQuantidade(data, type, full, meta); } } )
	aColunas.push( { "title": "Vl.Unit.",          "data": "PS2_PRECO",        "tipoDado": "N",        "sClass": "text-right",         "render": function (data, type, full, meta) { return scmFichaPrePedido_formatPreco(data, type, full, meta); } } )
	aColunas.push({ "title": "Desconto",           "data": "PS2_PRECO",        "tipoDado": "N",        "sClass": "text-right",         "render": function (data, type, full, meta) { return scmFichaPrePedido_formatDesconto(data, type, full, meta); } } );
    aColunas.push( { "title": "Vl.Total",          "data": "PS2_TOTAL",        "tipoDado": "N",        "sClass": "text-right",         "render": function (data, type, full, meta) { return scmFichaPrePedido_formatTotal(data, type, full, meta); } } )
	
	if( tpGetVal("#PS2_MODALI") !== "C" && getTetrisParams("SCM_OCULTA_IMPOSTOS_FICHA_PREPEDIDO_ITEM") == "N" ){
	    aColunas.push( { "title": "Impostos",          "data": "PS2_VALIPI",       "tipoDado": "N",        "sClass": "text-right",         "render": function (data, type, full, meta) { return scmFichaPrePedido_itens_impostos(data, type, full, meta); } } )
	}
	
	aColunas.push( { "title": "",                  "data": "ANEXOS",           "tipoDado": "C",        "sClass": "text-center",        "render": function (data, type, full, meta) { return scmFichaPrePedido_btnAnexo(data, type, full, meta); } } )
	aColunas.push( { "title": ""                   ,"data": null                                      , "sClass": "details-control", "render": function (data, type, full, meta) { return scmFichaPrePedido_renderBtnAcoes(data, type, full, meta); } } )
 
	
    if(existBlock(typeof scmFichaPrePedidoPE_itens_colunas)){
        aColunas = scmFichaPrePedidoPE_itens_colunas(aColunas);
	}
	
	return aColunas
}

function scmFichaPrePedido_btnAnexo(data, type, full, meta){
    
    var cHtml = ""
    var fnc1  = `scmFichaPrePedido_verAnexo('${full.ANEXOS.trim()}', '${full.PS2_NUM + full.PS2_ITEM}')`;
    	
    if ( !empty(full.ANEXOS) ){
        cHtml += `
            <a title="Ver anexos" onclick="${fnc1}">
                <i class="fa fa-paperclip" style="-webkit-text-fill-color: cadetblue;"></i>
                <span id="badge${ full.PS2_NUMSC.trim() }_${ full.PS2_ITEMSC.trim() }" class="badge badge-success" style="top:-10px;left:-2px;"></span>
            </a>
        `;
    } else if(scmFichaPrePedido.ACAO != 'V') {
        cHtml += `
            <a title="Ver anexos" onclick="${fnc1}">
                <i class="fa fa-paperclip" style="-webkit-text-fill-color: grey;"></i>
                <span id="badge${ full.PS2_NUMSC.trim() }_${ full.PS2_ITEMSC.trim() }" class="badge badge-success" style="top:-10px;left:-2px;"></span>
            </a>
        `;
    }
    
    return cHtml
}

function scmFichaPrePedido_verAnexo(cAnexos, chave){
    if(scmFichaPrePedido.ACAO == 'V') {
        TPnavpop('scmFichaAnexoLink.html #conteudo', `scmFichaAnexoLink_init('${cAnexos}')`, '50%');
    } else if(scmFichaPrePedido.ACAO == 'A'){
        var tabela = 'PS2';
        var indice = '1'
        var nomeCampo = 'PS2_ANEXOS'
        var codPre = tpGetVal("#txtNumPrePedido");
        TPnavpop('scmFichaAnexoLink.html #conteudo', `scmFichaAnexoLink_init('${cAnexos}', 'A', '${chave}', '${tabela}', '${indice}', '${nomeCampo}', 'scmFichaPrePedido_itens_createGrid("${codPre}")' )`, '50%');
    }
}


function scmFichaPrePedido_renderBtnAcoes(data, type, full, meta){
    
    var btnAcao = 'S';
    var acoes = `
        <div class="btn-group dropdown">
            <button type="button" 
                    class="btn btn-info btn-xs dropdown-toggle" 
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded="true">
                        Ação <span class="caret"></span>
            </button>
            <ul class="dropdown-menu pull-right">`;
    
    if (scmFichaPrePedido.ACAO !== 'V' ){
        acoes += `<li>${scmFichaPrePedido_itens_btnAlteracao(data, type, full, meta)}<li>`
    
	    if(getTetrisParams('SCM_HABILITA_RATEIO', 'SCM') == 'S') {
    	    acoes += `<li>${scmFichaPrePedido_itens_btnRateio(data, type, full, meta)}<li>`	
	    }
	    
	    if(getTetrisParams('SCM_HABILITA_RATEIO_PCO', 'SCM') == 'S') {
    	    acoes += `<li>${scmFichaPrePedido_itens_btnRateioPco(data, type, full, meta)}<li>`	
	    }
    
        acoes += `<li>${scmFichaPrePedido_itens_btnExcluir(data, type, full, meta)}<li>`
    }
    
    acoes += `<li>${scmFichaPrePedido_itens_btnInfo(data, type, full, meta)}<li>`
    
    acoes += `<li id ="btnExtrato">${scmFichaPrePedido_btnExtrato(data, type, full, meta)}<li>`

    acoes += `</ul>
    </div>`;

    return acoes;
}

function scmFichaPrePedido_btnExtrato(data, type, full, meta){
    if(scmFichaPrePedido.habilitaCamposVerba =='S'  ){
        $( tpSelector('#btnExtrato') ).show()
    }else{
        $( tpSelector('#btnExtrato') ).hide() 
    }
    
    let codigo = full.PS2_CODPLA
    let conta  = full.PS2_CO
    
    return `<a title="Exibir Extrato da Verba" onclick="scmFichaPrePedido_exibeExtrato('${codigo}', '${conta}')"><i class="fa fa-file-text-o"></i> Extrato da Verba</a>`
}

function scmFichaPrePedido_exibeExtrato(codigo, conta){
    //TPnav('scmListaHistorico.html #conteudo', `scmListaHistorico_init('${codigo}', '${conta}')` , '90%');
    TPnav('scmListaControleOrcamentario.html #conteudo', `scmListaControleOrcamentario_init('VO', '${codigo}', '')` , '90%');
    
}

function scmFichaPrePedido_formatPreco(data, type, full, meta){
    // data = data.replace(',', '.');
    
   	// return formatNumber(parseFloat(data), getTetrisParams("VALOR_MASK","SCM"));
   	
   	
   	var cDecimal = getTetrisParams("VALOR_MASK","SCM");
    var cChave = tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM);
    var cClass = ''
    var disabled = '';
    
    if(scmFichaPrePedido.ACAO == 'V' || full.PS2_TIPOPC.trim() == '2'){
        disabled = 'disabled';
    }
    
    var cRet = `    <div class="form-group">
                        <input id="txtPreco_${cChave}" type="text" onchange="scmFichaPrePedido_atualizaItem('${cChave}')" class="form-control text-right valor_mask inputsListaPrePedido" value="${formatNumber(full.PS2_PRECO,parseInt(cDecimal))}" style="padding: 2.5px; font-size:12.5px" ${disabled} />
                    </div>`
    return  cRet    
   	
}
function scmFichaPrePedido_formatDesconto(data, type, full, meta){
    var cDecimal = getTetrisParams("VALOR_MASK","SCM");
    var cChave   = tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM);
    var cClass   = '';
    var disabled = '';
    
    if(scmFichaPrePedido.ACAO == 'V' || full.PS2_TIPOPC.trim() == '2'){
        disabled = 'disabled';
    }
    
    var cRet = `    
        <div class="form-group">
            <input id="txtDescItem_${cChave}" type="text" onchange="scmFichaPrePedido_atualizaItem('${cChave}')" class="form-control text-right valor_mask inputsListaPrePedido" value="${formatNumber(full.PS2_VLDESC ,parseInt(cDecimal))}" ${disabled} />
        </div>`;
        
    return cRet;
}

function scmFichaPrePedido_formataPrioridade(data, type, full, meta){
    var codProdutokey   =  tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM);
    var dataFormat      =  moment(full.PS2_DTENTR, 'YYYYMMDD').format('DD/MM/YYYY');
    col = '';
    var prza = scmFichaPrePedido_validaPrioridade(full.PS2_PRZA)
    if(empty(prza)){
        prza = "Selecionar"
    }
    
    col += `<div class="col-xs-12 col-md-12 text-center" style="padding: 0px;">`;
    if(scmFichaPrePedido.ACAO == 'V'){
     col += `<span id="dataEntrega_${codProdutokey}" class="prevEntrega" style="color: #428bca">${prza}</span>`;
       prioridade = (full.PS2_PRZA == 'N' ? 'Normal' :
              full.PS2_PRZA == 'E' ? 'Emergencial' :
              full.PS2_PRZA == 'R' ? 'Regularização' :
              full.PS2_PRZA == 'C' ? 'Contrato' : 
              full.PS2_PRZA == 'D' ? 'Delegado' : '' )
               
        col = prioridade

    } else{
        col += `<a id="dataEntrega_${codProdutokey}" class="przaPrioridade" onclick="scmFichaPrePedido_alterPrioridade('${codProdutokey}')">${prza}</a>`; 
    }
    
    col += `<div id="" class="formPrioridadeEdit_${codProdutokey} entregaEdit" style="display: none"> 
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group" style=" margin-bottom: 5px;">
                                <select id="prioridade_${codProdutokey}" type="text" class="form-control  input-sm" style=" min-width: 90px;">
                                    <option value="N">Normal</option>
                					<option value="E">Emergencial</option>
                					<option value="R">Regularização</option>
                					<option value="C">Contrato</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 text-center" style=" margin-bottom: 5px; padding:0px;">
                            <button type="button" class="btn btn-success pull-rigth input-sm" onclick="scmFichaPrePedido_salvarPrioridade('${codProdutokey}', '${full.PS2_NUM}', '${full.PS2_ITEM}')">
                                <i class="fa fa-save"> </i>
                            </button>
                            <button type="button" class="btn btn-danger pull-rigth input-sm" onclick="scmFichaPrePedido_cancelarPrioridade('${codProdutokey}')">
                                <i class="fa fa-close"> </i>
                            </button>    
                        </div>     
                        <div class="col-sm-12 text-center" style="padding:0px;">
                            <a class="btn btn-primary input-sm" id="" onclick="scmFichaPrePedido_replicarPrioridade('${codProdutokey}', '${full.PS2_NUM}')" title="Replicar a data a todos os itens do orçamento">Replicar</a>
                        </div>
                    </div>
                </div>
            </div>`;
    
    return col;
}

function scmFichaPrePedido_salvarPrioridade(codProdutokey, numPedido, codItem){
    var prioridade    = tpGetVal(`#prioridade_${codProdutokey}`);
    let numItem     = tpConvert.decodeObj(codProdutokey);
    let PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
  
    tpParam.ClearParam(); 
    tpParam.AddParams('ACAO'            , 'A'); 
    tpParam.AddParams('ALIAS'           , 'PS2');
    tpParam.AddParams('INDICE'          , '1');
    tpParam.AddParams('CHAVE'           , numItem);
    tpParam.AddParams('PS2_PRZA'      , prioridade);
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var oDados = tpParam.SendFormPost('TABGENER')
    
    if (oDados.errorcode !== '00') {
        bootbox.alert(oDados.errormsg);

    }else{
          scmFichaPrePedido_itens_createGrid(PS2_NUM)
    }
}

function scmFichaPrePedido_replicarPrioridade(codProdutokey, numPedido) {
    var prioridade    = tpGetVal(`#prioridade_${codProdutokey}`);
    let numItem;
    let PS2_NUM;
    let PS2_ITEM;
    
    $(tpSelector('.przaPrioridade')).each(function () {
    
       numItem      = tpConvert.decodeObj($(this).attr('id').slice(12));
       PS2_NUM      = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
       PS2_ITEM     = numItem[6] + numItem[7] + numItem[8] + numItem[9];
       
        tpParam.ClearParam(); 
        tpParam.AddParams('ACAO'            , 'A'); 
        tpParam.AddParams('ALIAS'           , 'PS2');
        tpParam.AddParams('INDICE'          , '1');
        tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
        tpParam.AddParams('PS2_PRZA'      , prioridade);
		tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
        
        var oDados = tpParam.SendFormPost('TABGENER')
        
        if (oDados.errorcode !== '00') {
            bootbox.alert(oDados.errormsg);
        } 
    })
    scmFichaPrePedido_itens_createGrid(PS2_NUM)        
   
}

function scmFichaPrePedido_validaPrioridade(PS2_PRZA){
    var prioridade = (PS2_PRZA == 'N' ? 'Normal' :
              PS2_PRZA == 'E' ? 'Emergencial' :
              PS2_PRZA == 'R' ? 'Regularização' :
              PS2_PRZA == 'C' ? 'Contrato' : 
              PS2_PRZA == 'D' ? 'Delegado' : '' )
               
    return prioridade
}

function scmFichaPrePedido_alterPrioridade(codProdutokey) {
    TetrisDefaultMaskAll();
    $(tpSelector(`.formPrioridadeEdit_${codProdutokey}`)).slideToggle();
}

function scmFichaPrePedido_cancelarPrioridade(codProdutokey) {
    $(tpSelector(`.formPrioridadeEdit_${codProdutokey}`)).slideToggle();
}

function scmFichaPrePedido_formataQuantidade(data, type, full, meta){
    var comprador = scmBuscaComprador(usuarioLogado.codigoUsuario());
    var cDecimal = getTetrisParams('SCM_DECIMAL_QUANTIDADE');
    var cChave = tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM);
    var cClass = ''
    var disabled = '';
    var cValor = ( parseInt(cDecimal) == 0 ? parseFloat( full.PS2_QUANT, parseInt( cDecimal ) ): formatNumber(full.PS2_QUANT,parseInt(cDecimal) ) ) 
  
    if(scmFichaPrePedido.ACAO == 'V' || comprador.Y1_XEDQUPP !== 'S' || full.PS2_TIPOPC.trim() == '2'){
        disabled = 'disabled';
    }
    
    var cRet = `    <div class="form-group">
                        <input id="txtQuant_${cChave}" type="text" onchange="scmFichaPrePedido_atualizaItem('${cChave}')" class="form-control text-right valor_mask_qtd inputsListaPrePedido" value="${cValor}" style="padding: 2.5px; font-size:12.5px" ${disabled} />
                    </div>`
    return  cRet         
}

function scmFichaPrePedido_formatTotal(data, type, full, meta){
    var cChave = tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM);
    
    var cRet = `    <div class="form-group">
                        <input id="txtTotal_${cChave}" type="text" class="form-control text-right TOTAL valor_mask_total totalItem" value="${formatNumber(full.PS2_TOTAL, 2)}" style="padding: 2.5px; font-size:12.5px" disabled />
                    </div>`;
    return  cRet
    
}

function scmFichaPrePedido_itens_impostos(data, type, full, meta){
    var ret = '';
    if (full.PS2_VALIPI > 0 ) {
        ret += 'IPI:'+formatNumber(full.PS2_VALIPI,2)+'<br/>';
    }
	if (full.PS2_VLICMS > 0 ) {
        ret += 'ICMS:'+formatNumber(full.PS2_VLICMS,2)+'<br/>';
    } 
    if (full.PS2_ICMST > 0 ) {
        ret += 'ICMS ST:'+formatNumber(full.PS2_ICMST,2)+'<br/>';
    }
    if (full.PS2_ICMDA > 0 ) {
        ret += 'ICMS DA:'+formatNumber(full.PS2_ICMDA,2)+'<br/>';
    }
	if (full.PS2_VLPIS > 0 ) {
        ret += 'PIS:'+formatNumber(full.PS2_VLPIS,2)+'<br/>';
    }
    if (full.PS2_VLCOF > 0 ) {
        ret += 'COFINS:'+formatNumber(full.PS2_VLCOF,2)+'<br/>';
    } 
    
    return ret ;
    
}
function scmFichaPrePedido_itens_entrega(data, type, full, meta) {
    var codProdutokey   =  tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM);
    var dataFormat      =  moment(full.PS2_DTENTR, 'YYYYMMDD').format('DD/MM/YYYY');
    col = '';
    
    col += `<div class="col-xs-12 col-md-12 text-center" style="padding: 0px;">`;
    if(scmFichaPrePedido.ACAO == 'V'){
        col += `<span id="dataEntrega_${codProdutokey}" class="prevEntrega" style="color: #428bca">${dataFormat}</span>`;
    }
    else{
        col += `<a id="dataEntrega_${codProdutokey}" class="prevEntrega" onclick="scmFichaPrePedido_alteraData('${codProdutokey}')" title="Editar data de entrega do item do pedido">${dataFormat}</a>`; 
    }
    
    col += `<div id="" class="formEntregaEdit_${codProdutokey} entregaEdit" style="display: none"> 
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group" style=" margin-bottom: 5px;">
                                <input id="NovaDataEntrega_${codProdutokey}" type="text" class="form-control tp-date datepicker input-sm" style=" min-width: 90px;">
                            </div>
                        </div>
                        <div class="col-sm-12 text-center" style=" margin-bottom: 5px; padding:0px;">
                            <button type="button" class="btn btn-success pull-rigth input-sm" onclick="scmFichaPrePedido_salvarData('${codProdutokey}', '${full.PS2_NUM}', '${full.PS2_ITEM}')">
                                <i class="fa fa-save"> </i>
                            </button>
                            <button type="button" class="btn btn-danger pull-rigth input-sm" onclick="scmFichaPrePedido_cancelarData('${codProdutokey}')">
                                <i class="fa fa-close"> </i>
                            </button>    
                        </div>     
                        <div class="col-sm-12 text-center" style="padding:0px;">
                            <a class="btn btn-primary input-sm" id="checkNovaDataEntrega" onclick="scmFichaPrePedido_replicarData('${codProdutokey}', '${full.PS2_NUM}')" title="Replicar a data a todos os itens do orçamento">Replicar</a>
                        </div>
                        <div class="col-sm-12 text-center" style="padding:0px;">
                            <p id="alertaDataNegativa_${codProdutokey}" style="display: none;">A data selecionada deve ser superior à data de hoje.</p>
                        </div>
                    </div>
                </div>
            </div>`;
    
    return col;
}

function scmFichaPrePedido_alteraData(codProdutokey) {
    TetrisDefaultMaskAll();
    $(tpSelector(`.formEntregaEdit_${codProdutokey}`)).slideToggle();
    let data = moment($(tpSelector(`#dataEntrega_${codProdutokey}`)).html(), 'DD/MM/YYYY').format('YYYYMMDD');
    tpSetVal(`#NovaDataEntrega_${codProdutokey}`,  data);
    $(tpSelector(`#alertaDataNegativa_${codProdutokey}`)).hide();
}


function scmFichaPrePedido_salvarData(codProdutokey, numPedido, codItem){
    var novaData    = tpGetVal(`#NovaDataEntrega_${codProdutokey}`);
    var hoje        = moment().format('YYYYMMDD');
    let numItem     = tpConvert.decodeObj(codProdutokey);
    let PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
    let PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
    
    if(novaData == ''){
        toastr.warning("Data Invalida");
    }
    else{
        if((parseFloat(novaData) - parseFloat(hoje)) < 0){
            $(tpSelector(`#alertaDataNegativa_${codProdutokey}`)).show();
        }
        else{
            $(tpSelector(`#alertaDataNegativa_${codProdutokey}`)).hide();
            
            $(tpSelector("#dataEntrega_" + codProdutokey)).html(moment(novaData, 'YYYYMMDD').format('DD/MM/YYYY'));
            
            $(tpSelector(`.formEntregaEdit_${codProdutokey}`)).slideToggle();
            
            tpParam.ClearParam(); 
            tpParam.AddParams('ACAO'            , 'A'); 
            tpParam.AddParams('ALIAS'           , 'PS2');
            tpParam.AddParams('INDICE'          , '1');
            tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_DTENTR'      , novaData);
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
            
            var oDados = tpParam.SendFormPost('TABGENER')
            
            if (oDados.errorcode !== '00') {
                bootbox.alert(oDados.errormsg);
        
            }
        }
    }    
}

function scmFichaPrePedido_replicarData(codProdutokey, numPedido) {
    var novaData = tpGetVal(`#NovaDataEntrega_${codProdutokey}`);
    var hoje = moment().format('YYYYMMDD');
    let numItem;
    let PS2_NUM;
    let PS2_ITEM;
    
    if(novaData == ''){
        toastr.warning("Data Invalida");
        
    }else{
        if((parseFloat(novaData) - parseFloat(hoje)) < 0){
            $(tpSelector(`#alertaDataNegativa_${codProdutokey}`)).show();
        }
        else{
            $(tpSelector(`#alertaDataNegativa_${codProdutokey}`)).hide();
            
            $(tpSelector('.prevEntrega')).each(function () {
               $(this).html(moment(novaData, 'YYYYMMDD').format('DD/MM/YYYY'));
               
               numItem      = tpConvert.decodeObj($(this).attr('id').slice(12));
               PS2_NUM      = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
               PS2_ITEM     = numItem[6] + numItem[7] + numItem[8] + numItem[9];
               
                tpParam.ClearParam(); 
                tpParam.AddParams('ACAO'            , 'A'); 
                tpParam.AddParams('ALIAS'           , 'PS2');
                tpParam.AddParams('INDICE'          , '1');
                tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
                tpParam.AddParams('PS2_DTENTR'      , novaData);
				tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
                
                var oDados = tpParam.SendFormPost('TABGENER')
                
                if (oDados.errorcode !== '00') {
                    bootbox.alert(oDados.errormsg);
                } 
            })
            
            $(tpSelector(`.entregaEdit`)).hide('slow');    
        }
    }    
}

function scmFichaPrePedido_cancelarData(codProdutokey) {
    $(tpSelector(`.formEntregaEdit_${codProdutokey}`)).slideToggle();
}

function scmFichaPrePedido_itens_btnInfo(data, type, full, meta){
    if(!empty(full.PS2_NUMSC)){
        return `
            <a title="Detalhes SC" class="" style="padding-top: 0px;" onclick="scmDetalhesSCLiberacao_ByNumSC('${full.PS2_NUMSC}', '${full.PS2_ITEMSC}') "><i class="fa fa-info"></i>Visualizar SC</a>
        `;
    }else{
        return ''
    }

}

function scmFichaPrePedido_itens_btnRateio(data, type, full, meta){
	return `<a title="Editar Rateio" onclick="scmFichaPrePedido_openRateio('${full.PS2_NUM}', '${full.PS2_ITEM}', 'RATEIO_GERAL')")" >
				<i class="fa fa-sitemap" style="-webkit-text-fill-color: cadetblue;"></i>
				Rateio
			</a>`

}

function scmFichaPrePedido_itens_btnRateioPco(data, type, full, meta){
	return `<a title="Visualizar Rateio PCO" onclick="scmFichaPrePedido_openRateio('${full.PS2_NUM}', '${full.PS2_ITEM}', 'RATEIO_PC0')")" >
				<i class="fa fa-sitemap" style="-webkit-text-fill-color: cadetblue;"></i>
				Rateio PCO
			</a>`

}

function scmFichaPrePedido_openRateio( numPrePedido, itemPrePedido, rateio ) {
    var ENTIDADE = ''
    tpLoaderShow()
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM418');
    tpParam.AddParams('CODENT'  , numPrePedido);
    tpParam.AddParams('ENTIDADE', 'PS2');
    tpParam.AddParams('ITMENT'  , itemPrePedido);
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
 
    if(getTetrisParams('SCM_HABILITA_RATEIO_PCO', 'SCM') == 'S' && rateio == 'RATEIO_PC0') {
        tpParam.AddParams('EXPSQL'  , "IN: AND PSU_ENTCTB = 'PCO'");   
        ENTIDADE = 'PCO'
    }
    else{
        tpParam.AddParams('EXPSQL'  , "IN: AND PSU_ENTCTB <> 'PCO'");
        ENTIDADE = 'ALL'
    }
	
    tpParam.SendFormPostASync('WSGETCONS', oDados => {
        tpLoaderHide()

        if(oDados.errorcode != '00') {
            toastr.error(`Erro: ${oDados.errorcode} - ${oDados.errormsg}`)
        }

        let aData = ajustaraData(oDados)
        let dados_rateio_geral = tpConvert.encodeObj(aData)
       

        TPnavpop('scmRateio.html', `scmRateio_init('', '', '', '', '','${ENTIDADE}', '${dados_rateio_geral}', '', 'PP', 'V')`, '70%')
    })
}

function scmFichaPrePedido_salvarRateio( numPrePedido, itemPrePedido, dadosBase64 ) {
    tpLoaderShow()

    tpParam.ClearParam();
    tpParam.AddParams('ACAO'            , 'AR')
    tpParam.AddParams('PS2_NUM'         , numPrePedido);
    tpParam.AddParams('PS2_ITEM'        , itemPrePedido);
    tpParam.AddParams('PS2_MRATEI'      , tpConvert.decodeObj(dadosBase64));
	tpParam.AddParams('USAPROTHEUS',  getTetrisParams('SCM_USA_PROTHEUS','SCM'));
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

    tpParam.SendFormPostASync('UPDPS2', oDados => {
        tpLoaderHide()

        if(oDados.errorcode != '00') {
            toastr.error('Erro inesperado ao salvar o rateio!')
            console.log(oDados)
            return
        }

        toastr.success('Rateio salvo com sucesso!')
        scmFichaPrePedido_itens_createGrid(numPrePedido)
    });
}

function  scmFichaPrePedido_itens_classificacao(data, type, full, meta) {
    var ret = '';
    // Conta Contabil  - x
    if (!empty(full.PS2_CONTA)) {
        ret += 'Conta:'+full.PS2_CONTA+'<br/>';
    }
    // Centro de Custo - x
    if (!empty(full.PS2_CC)) {
        ret += 'C.Custo:'+full.PS2_CC+'<br/>';
    }
    // Item Contabil - x
    if (!empty(full.PS2_ITEMCT) ) {
        ret += 'It.Cta:'+full.PS2_ITEMCT+'<br/>';
    }
    // Classe de Valor - x
    if (!empty(full.PS2_CLVL)) {
        ret += 'Cl.Vl:'+full.PS2_CLVL+'<br/>';
    }
    // Planilha Orçamentaria - x
    if (!empty(full.PS2_CODPLA)) {
        ret += `${scmCore_nomeEntidade('AK1') == 'Planilha Orçamentária' ? 'Verba' : scmCore_nomeEntidade('AK1') }: ${full.PS2_CODPLA}<br/>`;
												   
    }
    // Conta Orçamentaria - x
    if (!empty(full.PS2_CO)) {
        ret += `${scmCore_nomeEntidade('AK3') == 'Conta Orçamentária' ? 'CO' : scmCore_nomeEntidade('AK3') } :${full.PS2_CO}<br/>`;
    }
    // Ordem de Produção - X
    if (!empty(full.PS2_OP)) {
        ret += 'OP:'+full.PS2_OP+'<br/>';
    }
    if (!empty(full.PS2_NUMSC)){
        ret += 'SC:<span title="' + full.PSH_NOME + '">' + full.PS2_NUMSC+'/'+full.PS2_ITEMSC + '</span>';
    }
    
    ret = scmFichaPrePedido_classificacao_todos(full);
    
    return ret ;
}

function scmFichaPrePedido_classificacao_todos(full){
    var ret = '';
    
    // Conta Contabil
    if(getTetrisParams('EXIBE_CONTA_CONTABIL', 'SCM') == 'S'){
	    ret += scmFichaPrePedido_formatarDDL('Conta:','idlinkCConta_','divSeletorConta_','ddlContaContabil_', full.PS2_CONTA, full, full.CT1_DESC01);
	}
	
    // Centro de Custo
    if(getTetrisParams('EXIBE_CC', 'SCM') == 'S'){
        ret += scmFichaPrePedido_formatarDDL('C.Custo:',"idlinkCC_","divSeletorCC_","ddlCentroCusto_",full.PS2_CC,full, full.CTT_DESC01);
	}
	
	// Item Contabil
	if(getTetrisParams('EXIBE_IT_CONTABIL', 'SCM') == 'S'){
		ret += scmFichaPrePedido_formatarDDL('It.Cta:','idlinkITCONTA_','divSeletorITCONTA_','ddlSeletorITCONTA_',full.PS2_ITEMCT,full, full.CTD_DESC01);
	}
    
    // Classe de Valor
	if(getTetrisParams('EXIBE_CLVL', 'SCM') == 'S'){
		ret += scmFichaPrePedido_formatarDDL('Cl.Vl:','idlinkCLVL_','divSeletorCLVL_','ddlSeletorCLVL_',full.PS2_CLVL,full, full.CTH_DESC01);
	}
	
    // Planilha Orçamentaria
	if(getTetrisParams('EXIBE_PCO', 'SCM') == 'S'){
        ret += scmFichaPrePedido_formatarDDL(`${scmFichaPrePedido.entidadePlanilha  == 'Planilha Orçamentária' ? 'Verba' : scmFichaPrePedido.entidadePlanilha}:`,'idlinkPO_','divSeletorPO_','ddlSeletorPO_',full.PS2_CODPLA,full, full.AK1_DESCRI);
    }
    
    // Conta Orçamentaria
    if(getTetrisParams('EXIBE_PCO', 'SCM') == 'S'){
        if(getTetrisParams("SCM_MODIFICA_BUSCA_VERBA") == 'AK2'){
            ret += scmFichaPrePedido_formatarDDL(`${scmFichaPrePedido.entidadeContaOrc == 'Conta Orçamentária' ? 'CO' : scmFichaPrePedido.entidadeContaOrc}:`,'idlinkCO_','divSeletorCO_','ddlSeletorCO_',full.PS2_CO,full, full.AK5_DESCRI); 
        }
        
        if(getTetrisParams("SCM_MODIFICA_BUSCA_VERBA") == 'AK6'){
            ret += scmFichaPrePedido_formatarDDL(`${scmFichaPrePedido.entidadeContaOrc == 'Conta Orçamentária' ? 'CO' : scmFichaPrePedido.entidadeContaOrc}:`,'idlinkCO_','divSeletorCO_','ddlSeletorCO_',full.PS2_CO,full, full.AK3_DESCRI);
        }
    }
    
    // Ordem de Produção
    if(getTetrisParams('SCM_HABILITA_ORDEM_PRODUCAO', 'SCM') == 'S'){
        ret += scmFichaPrePedido_formatarDDL('OP:','idlinkOP_','divSeletorOP_','ddlSeletorOP_',full.PS2_OP,full,full.OP);
    }
    
    if (!empty(full.PS2_NUMSC)){
        ret += 'SC:<span title="' + full.PSH_NOME + '">' + full.PS2_NUMSC+'/'+full.PS2_ITEMSC + '</span>';
    }
    
    if (tpGetVal("#PS2_MODALI") == "C" && !empty(full.PS2_TIPPLA)){
        ret += '<br/>Planilha:' + full.PS2_TIPPLA + '-' + full.CNL_DESCRI;
    }  
    
	return ret;	
}

function scmFichaPrePedido_formatarDDL(cTitulo,cIdLink,cIdDiv,cIdDDL,cConteudo,full,cDesc, tipo = 'input'){
    var result          = '';
    var cValueCodEnt    = ''
    if(cDesc == 'Produto'){
        result += '<div class="" style="padding: 0px; display:inline">';
    }
    else{
        cValueCodEnt = cConteudo;
        cConteudo    = scmFichaPrePedido.habilitaDescEntCont == "S" ? cDesc : cConteudo;
        
        result += '<div class="col-xs-12 col-md-12" style="padding: 0px;">';
    }
    
    
    if(scmFichaPrePedido.ACAO == 'V'){
        result += `${cTitulo} <span id="${cIdLink+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM)}" title="${cDesc}" style="color: #428bca">${cConteudo}</span>`;
    }
    else{
        if(empty(cConteudo)){
           result += `${cTitulo} <a id="${cIdLink+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM)}" data-codent="${cValueCodEnt}" title="${cDesc}" data-tt="${cTitulo}" onclick="scmFichaPrePedido_habilitaEdicaoddl('${cIdDiv+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM)}');">Selecionar</a>`; 
        }
        else{
        result += `${cTitulo} <a id="${cIdLink+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM)}" data-codent="${cValueCodEnt}" title="${cDesc}" data-tt="${cTitulo}" onclick="scmFichaPrePedido_habilitaEdicaoddl('${cIdDiv+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM)}');">${cConteudo}</a>`;
           
        }
    }
    
    result += `     <div id="${cIdDiv+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM)}" class="formCCEdit" style="display:none"> 
                        ${scmFichaPrePedido_montaEdicaoDDL(cIdDDL+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM) , cIdLink+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM) , cIdDiv+tpConvert.encodeObj(full.PS2_NUM+full.PS2_ITEM), tipo )}
                    </div>
              `
    result += '</div>';
    
    return result;
}

function scmFichaPrePedido_montaEdicaoDDL(cChave,cIdLink,cIdDiv, tipo) {
    var onchange ='' //"sfaPedidoColunaDataEntrega_novaDataEntrega('"+ codProdutokey +"')";
    var h = '';
    
    var cCampo = ( tipo == 'input'
                    ? `<input id="${cChave}" type="text" class="form-control input-sm" style=" min-width: 85px;" />`
                    : `<select id="${cChave}" tpcomponente="select" class="form-control input-sm" style=" min-width: 85px;"></select>` )

    h += `  <div class="row">
                <div class="col-sm-12">
                    <div class="form-group" style=" margin-bottom: 5px;">
                        ${cCampo}
                    </div>
                </div>
                <div class="col-sm-12" style=" margin-bottom: 5px; padding:0px;">
                    <div class="form-group col-sm-4" style=" margin-bottom: 5px; margin-right: 15px;">
                        <button type="button" class="btn btn-success pull-rigth input-sm" onclick="scmFichaPrePedido_salvarDDL('${cChave}','${cIdLink}','${cIdDiv}')">
                            <i class="fa fa-save"> </i> Salvar
                        </button>
                    </div>
                    <div class="form-group col-sm-4" style=" margin-bottom: 5px;">
                        <button type="button" class="btn btn-danger pull-rigth input-sm"  onclick="scmFichaPrePedido_cancelarEdicao('${cIdDiv}')">
                            <i class="fa fa-close"> </i> Cancelar
                        </button>    
                    </div>
                </div>    
            </div>
         `
    return h  
}

function scmFichaPrePedido_salvarDDL(cChaveDDL,cIdLink,cIdDiv){
    var valorID         = $(tpSelector('#'+cChaveDDL)).val();
    let cTitulo         = $(tpSelector('#'+cIdLink)).data('tt');
    let cTitle          = $(tpSelector('#'+cIdLink)).attr('title')
    let cValueSelector  = scmFichaPrePedido.habilitaDescEntCont == 'S' ? $(tpSelector('#'+cIdLink)).data('codent') : $(tpSelector('#'+cIdLink)).html();
    
    if(cChaveDDL.startsWith('ddlSeletorCODPLA_')) {
        if(valorID.trim() != cValueSelector?.trim()) {
            if(scmFichaPrePedido.habilitaDescEntCont == 'S'){
                $(tpSelector('#idlinkCO_' + cIdLink.replaceAll('idlinkCODPLA_', ''))).data('codent', '')
            } 
            $(tpSelector('#idlinkCO_' + cIdLink.replaceAll('idlinkCODPLA_', ''))).html('Não Selecionado')
        }
    }
    
    if(cChaveDDL.startsWith('ddlCentroCusto_') && scmFichaPrePedido.habilitaFiltroCOCC == 'S') {
        if(valorID.trim() != cValueSelector?.trim()) {
            if(scmFichaPrePedido.habilitaDescEntCont == 'S'){
                $(tpSelector('#idlinkCO_' + cIdLink.replaceAll('idlinkCC_', ''))).data('codent', '')
            } 
            $(tpSelector('#idlinkCO_' + cIdLink.replaceAll('idlinkCC_', ''))).html('Não Selecionado')
        }
    }
    
    if(empty(valorID)){
        if(cTitle == 'Produto'){
            toastr.warning('Por favor, selecione um Produto');
            return;
        }
        else{
            scmFichaPrePedido.habilitaDescEntCont == 'S' ? $(tpSelector('#'+cIdLink)).data('codent', '') : $(tpSelector('#'+cIdLink)).html('Selecionar');
        }
    
    }
    else{
        if(cTitulo == 'OP:'){
            let values  = valorID.split("-", 4)
            $(tpSelector('#'+cIdLink)).html(values[0]);
        }
        else if(cTitle == 'Produto'){
            let values  = valorID.split("_", 2)
            $(tpSelector('#'+cIdLink)).html(values[1])
        }
        else{
            if(scmFichaPrePedido.habilitaDescEntCont == 'S' ){
                var textID = getSelect2('#'+cChaveDDL, 'text').split('-')[1];
                $(tpSelector('#'+cIdLink)).html(textID.trim());
                $(tpSelector('#'+cIdLink)).data('codent', valorID);
                
            } else{
                $(tpSelector('#'+cIdLink)).html(valorID); 
            }
            
        }
        
    }
    
    $(tpSelector('#'+cIdDiv)).toggle(400);
    
    scmFichaPrePedido.idUltimoItemAlterado = cIdLink;
    
    scmFichaPrePedido_salvarDDL_BD(cChaveDDL,cIdLink,cIdDiv);
}

function scmFichaPrePedido_salvarDDL_BD(cChaveDDL,cIdLink,cIdDiv){
    let cTitulo         = $(tpSelector('#'+cIdLink)).data('tt');
    let conteudo        = $(tpSelector('#'+cIdLink)).text();
    let cTitle          = $(tpSelector('#'+cIdLink)).attr('title');
    let valSelect       = scmFichaPrePedido.habilitaDescEntCont == 'S' && cTitle != 'Produto'? $(tpSelector('#'+cIdLink)).data('codent') : $(tpSelector('#'+cChaveDDL)).val();
    let PS2_NUM         = '';
    let PS2_ITEM        = '';
    let numItem         = '';
    let infoProd;
    
    if(existBlock(typeof scmFichaPrePedidoPE_salvarDDL_BD)){
       scmFichaPrePedidoPE_salvarDDL_BD(cChaveDDL,cIdLink,cIdDiv)
    }else{
    
        if(cTitle == 'Produto'){
            let values  = valSelect.split("_", 2);
            let codProd = values[0];
            infoProd    = scmFichaPrePedido_buscaInfoProd(codProd);
        }
        
    
        tpParam.ClearParam(); 
        tpParam.AddParams('ACAO'        , 'A'); 
        tpParam.AddParams('ALIAS'       , 'PS2');
        tpParam.AddParams('INDICE'      , '1');
        
        
        if(cTitulo == 'Conta:'){
            numItem     = tpConvert.decodeObj(cIdLink.slice(13));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            
            tpParam.AddParams('CHAVE'       , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_CONTA'   , valSelect);
           
        }
        
        if(cIdLink.includes('idlinkCC_')){
            numItem     = tpConvert.decodeObj(cIdLink.slice(9));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            
            tpParam.AddParams('CHAVE'       , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_CC'      , valSelect);
            
            if(scmFichaPrePedido.habilitaFiltroCOCC == 'S'){
                tpParam.AddParams('PS2_CO'          , ' ');
            }
           
        }
        
        if(cTitulo == 'It.Cta:'){
            numItem     = tpConvert.decodeObj(cIdLink.slice(14));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            
            tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_ITEMCT'      , valSelect);
           
        }
        
        if(cTitulo == 'Cl.Vl:'){
            numItem     = tpConvert.decodeObj(cIdLink.slice(11));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            
            tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_CLVL'        , valSelect);
           
        }
        
        if(cIdLink.includes('idlinkPO')){
            numItem     = tpConvert.decodeObj(cIdLink.slice(9));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            
            tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_CODPLA'      , valSelect);
            tpParam.AddParams('PS2_CO'          , ' ');
           
        }
        
        if(cIdLink.includes('idlinkCO')){
            numItem     = tpConvert.decodeObj(cIdLink.slice(9));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            
            tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_CO'          , valSelect);
           
        }
        
        if(cTitulo == 'OP:'){
            numItem     = tpConvert.decodeObj(cIdLink.slice(9));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            let values  = valSelect.split("-", 4);
            
            tpParam.AddParams('CHAVE'           , PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_OP'          , values[0]);
            tpParam.AddParams('PS2_PRODOP'      , values[1]);
            tpParam.AddParams('PS2_DESCOP'      , `${values[2]}-${values[3]}`);
           
        }
        
        if(cTitle == 'Produto'){
            if(getTetrisParams("SCM_PERMISSAO_PARA_ALTERAR_UNIDADE_DE_MEDIDA") == "S"){
                $(tpSelector('#txtUnidade')).attr('disabled', false);
            }
            else{
                $(tpSelector('#txtUnidade')).attr('disabled', true);
            }
            
            numItem     = tpConvert.decodeObj(cIdLink.slice(11));
            PS2_NUM     = numItem[0] + numItem[1] + numItem[2] + numItem[3] + numItem[4] + numItem[5];
            PS2_ITEM    = numItem[6] + numItem[7] + numItem[8] + numItem[9];
            let values  = valSelect.split("_", 2);
            
            tpParam.AddParams('CHAVE'           ,PS2_NUM + PS2_ITEM);
            tpParam.AddParams('PS2_PRODUT'      ,values[0]);
            tpParam.AddParams('PS2_DESC'        ,values[1]);
            tpParam.AddParams('PS2_GRUPO'       ,infoProd.B1_GRUPO);
            tpParam.AddParams('PS2_UM'          ,infoProd.B1_UM);
            tpParam.AddParams('PS2_CONTA'       ,infoProd.B1_CONTA);
    
        }
        
    	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
        var oDados = tpParam.SendFormPost('TABGENER')
      
        if (oDados.errorcode == '00') {
            if(cTitle == 'Produto'){
                scmFichaPrePedido_atualizaCodProdPS1(PS2_NUM.trim(), PS2_ITEM.trim(), infoProd.B1_COD, infoProd.B1_DESC)
            }    
            
            toastr.success("Alterado com Sucesso");
            scmFichaPrePedido_itens_createGrid(PS2_NUM)
            
        }else{
            bootbox.alert(oDados.errormsg);
        } 
    }
}


function scmFichaPrePedido_atualizaCodProdPS1(PS2_NUM, PS2_ITEM, PS2_PRODUT, PS2_DESC){
    var objItem = scmFichaPrePedido.aData.find(data=>{
        if(data.PS2_NUM.trim() == PS2_NUM && data.PS2_ITEM.trim() == PS2_ITEM){
            return data;
        }
    })
    
    if(!empty(objItem)){
        tpParam.ClearParam(); 
        tpParam.AddParams('ACAO'        , 'A'); 
        tpParam.AddParams('ALIAS'       , 'PS1');
        tpParam.AddParams('INDICE'      , '1');
        tpParam.AddParams('CHAVE'       , objItem.PS2_NUMSC + objItem.PS2_ITEMSC);
        tpParam.AddParams('PS1_CODPRO'  , PS2_PRODUT);
        tpParam.AddParams('PS1_DESCRI'  , PS2_DESC);

        var oDados = tpParam.SendFormPost('TABGENER')
        
        if(oDados.errorcode != '00'){
            bootbox.alert(oDados.errormsg);
        }
    }
}

function scmFichaPrePedido_buscaInfoProd(codProd){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM037')
    tpParam.AddParams('B1_COD'  , codProd)
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
	
    var oDados = tpParam.SendFormPost('WSGETCONS');
    var data = ajustaraData(oDados);
	
    return data[0];
}

function scmFichaPrePedido_habilitaEdicaoddl(cComponent){
    $(tpSelector('#'+cComponent)).toggle(400);
}

function scmFichaPrePedido_cancelarEdicao(cComponent){
    $(tpSelector('#'+cComponent)).toggle(400);    
    
}


function scmFichaPrePedido_itens_getOTableTools() {
	return {
		"sRowSelect": "single",
		"aButtons": []
	}
}

function scmFichaPrePedido_itens_numItemSC(data, type, full, meta){
    var ret = '';
    
    if (!empty(full.PSH_NOME))
        ret += full.PSH_NOME + '</br>'; 
        
    if (!empty(full.PS2_NUMSC)) 
        ret += full.PS2_NUMSC+'/'+full.PS2_ITEMSC;
    
	return ret;
}

function scmFichaPrePedido_itens_produtoServico(data, type, full, meta) {
	var coluna = '';
	var comprador = scmBuscaComprador(usuarioLogado.codigoUsuario());
	
	 if(!empty(full.PS2_PRODUT)){
         coluna += ' (<a title="Detalhes" onclick="scmDetalhePedidoCompra_Detalhe(\''+full.PS2_PRODUT+'\', \'' + full.PS2_FILIAL +'\')">' + full.PS2_PRODUT + '</a>) ';
    }
	
// 	Produto Generico
    if(empty(full.PS2_PRODUT)){
        coluna += scmFichaPrePedido_formatarDDL('','idlinkProd_','divSeletorProd_','ddlSeletorProd_',full.PS2_DESC,full,'Produto');
    }else if(!empty(full.PS2_PRODUT)){
        if(comprador.Y1_XEDPRPP == "S" && full.PS2_TIPOPC.trim() !== '2' ){
            coluna += scmFichaPrePedido_formatarDDL('','idlinkProd_','divSeletorProd_','ddlSeletorProd_',full.PS2_DESC,full,'Produto');
        }
        else{
            coluna += full.PS2_DESC;
        }
    }
    
    if ( !empty(full.PS2_OBS) ){
        coluna += '<small>Desc. Compl.: ' + full.PS2_OBS + '</small><br />';
    }
    
    if((!empty(full.PS2_PRODUT) && getTetrisParams("SCM_PERMISSAO_PARA_ALTERAR_UNIDADE_DE_MEDIDA") == "N") || full.PS2_TIPOPC.trim() == '2'){
        $(tpSelector('#txtUnidade')).attr('disabled', true);
    }
	
	return coluna;
}

function scmFichaPrePedido_itens_prePredidoItem(data, type, full, meta) {
	var coluna = '';
	//coluna += full.PS2_NUM + ' / ' + full.PS2_ITEM;
	coluna += '<span><i class="fa ' + (!empty(full.PS2_PRODUT) ? 'fa-check-circle" style="color: green' : 'fa-times-circle" style="color: red') + '"></i></span>&nbsp;' + full.PS2_ITEM;
	return coluna;
}

function scmFichaPrePedido_itens_solicitante(data, type, full, meta) {

	var coluna = '';
	coluna += '' + full.PSH_NOME + '<br />';
	// coluna    += '<small>Entregar em: ' + full. + '</small><br />';
	return coluna;
}

//INICIO DA FUNÇÃO EXCLUIR-----------------------------------

function scmFichaPrePedido_itens_btnExcluir(data, type, full, meta) {
	if (scmFichaPrePedido.data.PS2_STATUS != '001' & scmFichaPrePedido.data.PS2_STATUS != '003') {
		return ''
	}
	else {
		var fnc = "scmFichaPrePedido_itens_excluir('" + data.PS2_NUM + "','" + data.PS2_ITEM + "');";
		return '<a title="Remover Registro" onclick="' + fnc + '" ><i class="' + GetIcone('ERASE') + '"></i>Excluir </a>';
	}
}

function scmFichaPrePedido_itens_excluir(codigo, item) {

	var message = "Deseja mesmo excluir o item <b>" + item + "</b>, do Pré-Pedido <b>" + codigo + "</b>?";

	bootbox.confirm(message, function (result) {

		if (result) {

			tpParam.ClearParam();
			tpParam.AddParams('ACAO', 'E');
			tpParam.AddParams('PS2_NUM', codigo);
			tpParam.AddParams('PS2_ITEM', item);
			tpParam.AddParams('USAPROTHEUS',  getTetrisParams('SCM_USA_PROTHEUS','SCM'));
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

			var oDados = tpParam.SendFormPost('UPDPS2');

			if (oDados.errorcode == '00') {

				scmFichaPrePedido_cancelarEdicaoItem();
				
				scmFichaPrePedido_itens_createGrid($(tpSelector("#txtNumPrePedido")).val());
	            if(tpGetVal('#PS2_MODALI') == 'A'){
				    scmFichaPrePedido_createGridItensContrato()
				}            
            }
			else {
				bootbox.alert(oDados.errormsg.replace(/\n/g, '\\n'));
			}
		}

	});
}

//FIM DA FUNÇÃO EXCLUIR --------------------------------------

/* Validar o preenchimento da Ficha 
    ACAO 'I'  -> Inclusão de item
    ACAO 'A'  -> Alteracao de item
    ACAO 'S'  -> Salvar Cabeçalho
    ACAO 'FP' -> Finalizar Pre Pedido
*/

function scmFichaPrePedido_validar(acao) {
    
    var CamposRequeridos = '';
    
    var validarCamposCabec          = [];
    var validarCamposCondForn       = [];
    var validarCamposItemPP         = [];
    var CamposRequeridosItemPP      = '';
    var CamposRequeridosCabec       = '';
    var CamposRequeridosCondForn    = ''
    var cabecValido                 = false;
    var condFornValido              = true;
	var itemPPValido                = false;
	var lValidPE                    = true;
	var condPagamento               = false;
	var objReturnPE                 = {};
    
    /*==INTEGRAÇÕES==*/
    var apiValido                   = true;
    var CamposRequeridosAPI         = '';
    
    if(acao == 'I'){ //Inclusão de Item de Pré-Pedido
    
        if(getTetrisParams('EXIBE_CC', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_CC', 'SCM') == 'S' && empty(tpGetVal('ddlCentroCusto'))){
			CamposRequeridosItemPP += 'ddlCentroCusto,';
		}

		if(getTetrisParams('EXIBE_CLVL', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_CLVL', 'SCM') == 'S' && empty(tpGetVal('PS2_CLVL'))){
			CamposRequeridosItemPP += 'PS2_CLVL,';
		}

		if(getTetrisParams('EXIBE_CONTA_CONTABIL', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_CONTA_CONTABIL', 'SCM') == 'S' && empty(tpGetVal('PS2_CONTA'))){
			CamposRequeridosItemPP += 'PS2_CONTA,';
		}

		if(getTetrisParams('EXIBE_IT_CONTABIL', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_IT_CONTABIL', 'SCM') == 'S' && empty(tpGetVal('PS2_ITEMCT'))){
			CamposRequeridosItemPP += 'PS2_ITEMCT,';
		}
		
		if ( getTetrisParams('SCM_HABILITA_CENTRAL_FORNECEDOR','SCM') == 'S' && empty(tpGetVal('ddlTipoFollowUp')) ){
		    //toastr.warning('O campo "Tipo follow-Up" é obrigatório.');
			//CamposRequeridosItemPP += 'ddlTipoFollowUp,';
		}
		
		if(getTetrisParams('SCM_HABILITA_CAMPO_PROJETO_PP', 'SCM') == 'S' && getTetrisParams('SCM_OBRIGA_CAMPO_PROJETO_PP', 'SCM') == 'S' && empty(tpGetVal('ddlProjeto'))){
            CamposRequeridosItemPP += 'ddlProjeto,';
        }
        
        if(getTetrisParams('SCM_HABILITA_CAMPO_REVISAO_PP', 'SCM') == 'S' && getTetrisParams('SCM_OBRIGA_CAMPO_REVISAO_PP', 'SCM') == 'S' && empty(tpGetVal('ddlRevisao'))){
            CamposRequeridosItemPP += 'ddlRevisao,';
        }
        
        if(getTetrisParams('SCM_HABILITA_CAMPO_TAREFA_PP', 'SCM') == 'S' && getTetrisParams('SCM_OBRIGA_CAMPO_TAREFA_PP', 'SCM') == 'S' && empty(tpGetVal('ddlTarefa'))){
            CamposRequeridosItemPP += 'ddlTarefa,';
        }
        
        if(getTetrisParams('OBRIGATORIO_TIPOSC', 'SCM') == 'S' && empty(tpGetVal('PS2_IDPSN'))){
            CamposRequeridosItemPP += 'PS2_IDPSN,';
        }
        
		if(getTetrisParams('EXIBE_PCO', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_PCO', 'SCM') == 'S' && empty(tpGetVal('ddlPlanOrc'))){
			CamposRequeridosItemPP += 'ddlPlanOrc,';
		}
		
		if(getTetrisParams('EXIBE_PCO', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_PCO', 'SCM') == 'S' && empty(tpGetVal('ddlContaOrc'))){
			CamposRequeridosItemPP += 'ddlContaOrc,';
		}
		
        /*=== Campos Requeridos API ===*/
        
        //SAP B1
        if(scmFichaPrePedido.integraAPISAP == "S"){
            
            var moeda = tpGetVal('ddlMoeda');
            
            if(moeda == "2" || moeda == "4"){
                CamposRequeridosAPI = "txMoeda";
            }											  
        }
        /*=============================*/
        
        if(existBlock(typeof scmFichaPrePedidoPE_validar)){
            lValidPE = scmFichaPrePedidoPE_validar(true);
            if (!lValidPE){
                return lValidPE
            }
        }

        CamposRequeridosCabec = 'ddlFornecedor,ddlComprador';
        CamposRequeridosItemPP += 'ddlEntregar,ddlProdutos,txtQtde,txtUnidade,txtDtEntrega,txtValor,txtValorTotalItem'
        
        if( tpGetVal("#PS2_MODALI") == "C" ){
            CamposRequeridosItemPP += ',PS2_TIPPLA'
            
            if(tpGetVal('#PS2VINC') =='S'){
                CamposRequeridosItemPP += ',PS2_NUMCON'
            }
        }
        
        if(existBlock(typeof scmFichaPrePedidoPE_validarCampos)){
            objReturnPE             = scmFichaPrePedidoPE_validarCampos(acao, CamposRequeridosCabec, CamposRequeridosItemPP, CamposRequeridosAPI);
            CamposRequeridosCabec   = objReturnPE.CamposRequeridosCabec
            CamposRequeridosItemPP  = objReturnPE.CamposRequeridosItemPP
            CamposRequeridosAPI     = objReturnPE.CamposRequeridosAPI
        }
		
        validarCamposCabec  = CamposRequeridosCabec.split(',');
        validarCamposItemPP = CamposRequeridosItemPP.split(',');
        validarCamposAPI    = CamposRequeridosAPI.split(',');
        
        cabecValido     = scmCore_validarCamposRequeridos('divCabecalho'       , validarCamposCabec);
        itemPPValido    = scmCore_validarCamposRequeridos('divItemPrePedido'   , validarCamposItemPP);
        
        if(!empty(validarCamposAPI[0])){
            apiValido   = scmCore_validarCamposRequeridos('divCabecalho'       , validarCamposAPI);
        }
        
        return (cabecValido && condFornValido && itemPPValido && apiValido);
  
    }
    else if(acao == 'A'){
        
        if(getTetrisParams('EXIBE_CC', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_CC', 'SCM') == 'S' && empty(tpGetVal('ddlCentroCusto'))){
			//toastr.warning('O campo "Centro de Custo" é obrigatório.');
			CamposRequeridosItemPP += 'ddlCentroCusto,';
		}

		if(getTetrisParams('EXIBE_CLVL', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_CLVL', 'SCM') == 'S' && empty(tpGetVal('PS2_CLVL'))){
			toastr.warning('O campo "Classe de Valor" é obrigatório.');
			CamposRequeridosItemPP += 'PS2_CLVL,';
		}

		if(getTetrisParams('EXIBE_CONTA_CONTABIL', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_CONTA_CONTABIL', 'SCM') == 'S' && empty(tpGetVal('PS2_CONTA'))){
			toastr.warning('O campo "Conta Contábil" é obrigatório.');
			CamposRequeridosItemPP += 'PS2_CONTA,';
		}

		if(getTetrisParams('EXIBE_IT_CONTABIL', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_IT_CONTABIL', 'SCM') == 'S' && empty(tpGetVal('PS2_ITEMCT'))){
			toastr.warning('O campo "Item Contábil" é obrigatório.');
			CamposRequeridosItemPP += 'PS2_ITEMCT,';
		}
		
		if ( getTetrisParams('SCM_HABILITA_CENTRAL_FORNECEDOR','SCM') == 'S' && empty(tpGetVal('ddlTipoFollowUp')) ){
			//toastr.warning('O campo "Tipo follow-Up" é obrigatório.');
			//CamposRequeridosItemPP += 'ddlTipoFollowUp,';
		}
		
		if(getTetrisParams('SCM_HABILITA_CAMPO_PROJETO_PP', 'SCM') == 'S' && getTetrisParams('SCM_OBRIGA_CAMPO_PROJETO_PP', 'SCM') == 'S' && empty(tpGetVal('ddlProjeto'))){
            toastr.warning('O campo "Projeto" é obrigatório.');
            CamposRequeridosItemPP += 'ddlProjeto,';
        }
        
        if(getTetrisParams('SCM_HABILITA_CAMPO_REVISAO_PP', 'SCM') == 'S' && getTetrisParams('SCM_OBRIGA_CAMPO_REVISAO_PP', 'SCM') == 'S' && empty(tpGetVal('ddlRevisao'))){
            toastr.warning('O campo "Revisão" é obrigatório.');
            CamposRequeridosItemPP += 'ddlRevisao,';
        }
        
        if(getTetrisParams('SCM_HABILITA_CAMPO_TAREFA_PP', 'SCM') == 'S' && getTetrisParams('SCM_OBRIGA_CAMPO_TAREFA_PP', 'SCM') == 'S' && empty(tpGetVal('ddlTarefa'))){
            toastr.warning('O campo "Tarefa" é obrigatório.');
            CamposRequeridosItemPP += 'ddlTarefa,';
        }
        
        if(getTetrisParams('OBRIGATORIO_TIPOSC', 'SCM') == 'S' && empty(tpGetVal('PS2_IDPSN'))){
            toastr.warning('O campo "Tipo SC" é obrigatório.');
            CamposRequeridosItemPP += 'PS2_IDPSN,';
        }
        
		if(getTetrisParams('EXIBE_PCO', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_PCO', 'SCM') == 'S' && empty(tpGetVal('ddlPlanOrc'))){
			CamposRequeridosItemPP += 'ddlPlanOrc,';
		}
		
		if(getTetrisParams('EXIBE_PCO', 'SCM') == 'S' && getTetrisParams('OBRIGATORIO_PCO', 'SCM') == 'S' && empty(tpGetVal('ddlContaOrc'))){
			CamposRequeridosItemPP += 'ddlContaOrc,';
		}
		
        if(existBlock(typeof scmFichaPrePedidoPE_validar)){
            lValidPE = scmFichaPrePedidoPE_validar(true);
            if (!lValidPE){
                return lValidPE
            }
        }
		
        CamposRequeridosItemPP += 'ddlEntregar,ddlProdutos,txtQtde,txtUnidade,txtDtEntrega,txtValor,txtValorTotalItem';
        
        if( tpGetVal("#PS2_MODALI") == "C" ){
            CamposRequeridosItemPP += ',PS2_TIPPLA'
            
            if(tpGetVal('#PS2VINC') =='S'){
                CamposRequeridosItemPP += ',PS2_NUMCON'
            }
        }
        
        if(existBlock(typeof scmFichaPrePedidoPE_validarCampos)){
            objReturnPE             = scmFichaPrePedidoPE_validarCampos(acao, CamposRequeridosCabec, CamposRequeridosItemPP, CamposRequeridosAPI);
            CamposRequeridosCabec   = objReturnPE.CamposRequeridosCabec
            CamposRequeridosItemPP  = objReturnPE.CamposRequeridosItemPP
            CamposRequeridosAPI     = objReturnPE.CamposRequeridosAPI
        }
        
        validarCamposItemPP = CamposRequeridosItemPP.split(',');
        
        return scmCore_validarCamposRequeridos('divItemPrePedido', validarCamposItemPP);
    }
    else { //Finalizar Pre Pedido && Salvar Cabeçalho do Pré-Pedido
        
        if ( getTetrisParams('SCM_HABILITA_CENTRAL_FORNECEDOR','SCM') == 'S' && empty(tpGetVal('ddlTipoFollowUp')) ){
			CamposRequeridosCondForn = 'ddlTipoFollowUp,';
		}
		
		CamposRequeridosCabec = 'ddlFornecedor,ddlComprador,ddlMoeda';
        // CamposRequeridosCondForn += 'ddlCondPag';
		condPagamento = scmCore_validarCamposRequeridos('divCONDPAG', ['ddlCondPag']);
		$('[id^="PS2_CODBAR"]').each(function() {
        
            if(empty(tpGetVal($(this).attr('id')))){
                
                condPagamento = scmCore_validarCamposRequeridos('divCONDPAG', [$(this).attr('id')]);
                
            }
        });
        
// 		if(getTetrisParams("SCM_OCULTA_EMAIL_E_CONTATO_FICHA_PREPEDIDO") !== 'S'){
            
//             // Verifica se existe um fornecedor cadastrado selecionado ou não
//             if(empty($(tpSelector("#ddlFornecedor")).val())) {
//                 CamposRequeridosCabec += ',txtContato';
//             } 
//             else if(scmFichaPrePedido.habilitaContatoFornecedor == "S") {
                
//                 if(!empty(tpGetVal('ddlContato'))){
//                     CamposRequeridosCabec += ',ddlContato';
//                 }
//             } 
//             else{
//                 CamposRequeridosCabec += ',txtContato';
//             }
//         }																		  
		
        if(scmFichaPrePedido.tipoFreteObrigatorioPP.trim() == 'S'){
            CamposRequeridosCondForn += ',ddlFrete';
        }
        
        if(scmFichaPrePedido.justificativaObrigatorioPP.trim() == 'S'){
            CamposRequeridosCondForn += ',PS2_JUSTIF';
        }
        
        if(scmFichaPrePedido.msgPedidoObrigatorio.trim() == 'S'  ){
            //toastr.warning('O campo Mensagem Pedido é obrigatório.');
            CamposRequeridosCondForn += ',PS2_IDPSM';
        }
       
        if(getTetrisParams('HABILITA_LOCAL_FATURAMENTO','SCM') == 'S'){
            CamposRequeridosCabec += ',ddlLocalFaturamento';
        }
        
        if(existBlock(typeof scmFichaPrePedidoPE_validarCamposCabecalho)){
            CamposRequeridosCabec += scmFichaPrePedidoPE_validarCamposCabecalho(acao)
        }
        
        /*=== Campos Requeridos API ===*/
        
					  
        if(scmFichaPrePedido.integraAPISAP == "S"){
            
            var moeda = tpGetVal('ddlMoeda');
            
            if(moeda == "2" || moeda == "4"){
                CamposRequeridosCabec += ",txMoeda";
            }
        }
        /*=============================*/
        
        validarCamposCabec = CamposRequeridosCabec.split(',');
        
        if(!empty(CamposRequeridosCondForn)) {
            validarCamposCondForn = CamposRequeridosCondForn.split(',');
        }
        
        cabecValido = scmCore_validarCamposRequeridos('divCabecalho', validarCamposCabec);
        
       if(!empty(validarCamposCondForn)) {
            validarCamposCondForn = validarCamposCondForn.filter( data => {
				if(!empty(data)){
					return data;
				}
			})
            condFornValido = scmCore_validarCamposRequeridos('divCondicoesFornecimento', validarCamposCondForn);
        }
        
		
        contrato = true;
        if( tpGetVal("#PS2_MODALI") == "A" ){
            
            validarCamposContParce = 'PS2_XGESTO,PS2_APRCON,PS2_VIGINI,PS2_VIGFIM,PS2_TPCON,PS2_CUMULA,PS2_DTRENO,PS2_DTLREN,PS2_DAVIRE,PS2_LIMCAN,PS2_TOLERA'.split(',');
            contrato = scmCore_validarCamposRequeridos('divInfoContratoParceria', validarCamposContParce);
        }
        else if( tpGetVal("#PS2_MODALI") == "C" ){
            
            strValidarCamposContrato = 'PS2_DSCCON,PS2_TPCTO,PS2_UNVIGE,PS2_FLGRES,PS2_FLGCAU,PS2_PEDTII'
            // validarCamposContrato = strValidarCamposContrato.split(',');
            
            if(tpGetVal("#PS2_UNVIGE") !== "I"){
               validarCamposContrato = ',PS2_VIGE'
            }
            
            if (tpGetVal('PS2_FLGRES') == 'S'){
                validarCamposContrato = ',PS2_INDICE'
            }
            
            if (tpGetVal('PS2_FLGCAU') == 'S'){
                validarCamposContrato = ',PS2_TPCAU,PS2_MINCAU'
            }
            
            if(tpGetVal('#PS2VINC') =='S'){
                validarCamposContrato += ',PS2_NUMCON'
            }
            
            validarCamposContrato = validarCamposContrato.split(',');
            
            if( existBlock( typeof scmFichaPrePedidoPE_validar_camposContrato ) ) {
                validarCamposContrato = scmFichaPrePedidoPE_validar_camposContrato( validarCamposContrato )
            }
            
            contrato = scmCore_validarCamposRequeridos('divDadosContrato', validarCamposContrato);
        }
        
        if(!condFornValido) {
            return (cabecValido && condFornValido && contrato && condPagamento);
        }
        else{
            return (cabecValido && contrato && condPagamento);
        }
    }
}

function scmFichaPrePedido_verificarRegularizar() {
    var encontrado = false;
    if(( tpGetVal('#ddlPrioridadeCab') == 'R' || tpGetVal('#ddlPrioridadeCab') == 'C' ) && ( !empty(tpGetVal('#PS2_NFNUM')) && !empty(tpGetVal('#PS2_NFSERI')) && !empty(tpGetVal('#PS2_NFEMIS')) && !empty(tpGetVal('#PS2_NFVENC')) && !empty(tpGetVal('#PS2_NFANEX')) )){
        encontrado = true;
    }

    return encontrado;
}

/**
 * Chamadas para UPDPS2
 * ACAO = 'S' - Salvar o Cabeçalho do Pré-Pedido
 * ACAO = 'I' - Incluir um Item do Pré-Pedido
 * ACAO = 'A' - Alterar um Item do Pré-Pedido
 */
function scmFichaPrePedido_save(ACAO) {
	var valido = scmFichaPrePedido_validar(ACAO);
    let rateio_geral = '';
    
    var numPre = $(tpSelector("#txtNumPrePedido")).val();
	
	if (!empty(numPre)){
	    let saveSA5 = scmFichaPrePedido_salvaProdPTC(numPre);
        if(!saveSA5){
            $(tpSelector('#btnFinalizarAguarde')).hide();
	        $(tpSelector('#btnFinalizar')).show();
	        hideLoader();
	        return;
	    }
	}
	 
    if( ( getTetrisParams('SCM_HABILITA_RATEIO', 'SCM') == 'S' || getTetrisParams('SCM_HABILITA_RATEIO_PCO', 'SCM') == 'S') && ACAO !== 'S') {
	    if(getTetrisParams('SCM_EXIBE_RATEIO_GERAL', 'SCM') == 'S') {
	        rateio_geral = scmFichaPrePedido_processaRateioGeralCompleto();
	    }else{
	        rateio_geral = scmFichaPrePedido_processaRateioGeral();
	    }
    }

	if (valido) {
		tpParam.ClearParam();
		tpParam.AddParams('ACAO', ACAO);
		tpParam.AddParams('PS2_NUM', $(tpSelector("#txtNumPrePedido")).val());
		tpParam.AddParams('PS2_TIPOPC', $(tpSelector("#txtTipoPedido")).val());
		try {
			var ddlFornecedor   =   $(tpSelector("#ddlFornecedor")).select2('data');
			var PS2_FORNEC      =   ddlFornecedor.id.split('/')[0];			/* PS2_FORNEC */
			var PS2_LOJA        =   ddlFornecedor.id.split('/')[1];				/* PS2_LOJA */

            // Verifica se o fornecedor selecionado é cadastrado ou não
            var PS2_FORDES = ''
            if(ddlFornecedor.text.split(' - ')[1]) {
        	    PS2_FORDES      =   ddlFornecedor.text.split(' - ')[1];
        	} else {
        	    PS2_FORDES      =   ddlFornecedor.text.trim();
        	}

			tpParam.AddParams('PS2_FORNEC', PS2_FORNEC);
			tpParam.AddParams('PS2_LOJA',   PS2_LOJA);
			tpParam.AddParams('PS2_FORDES', PS2_FORDES);
		}
		catch (e) { }

		if (ACAO == 'S') {
			/**
			 * Campos ACAO = 'S' 
			 * PS2_FORNEC, PS2_LOJA, PS2_FORDES, PS2_COND, PS2_OBSPGT, PS2_TPFRET, PS2_VLFRET, PS2_VLSEGU, PS2_CONTAT, PS2_OBSPRE
			 */
			
			if (getTetrisParams('SCM_DEFINE_MESMA_PRIORIDADE_ITENS_SC', 'SCM') == 'S'){
			    tpParam.AddParams('PS2_PRZA',   tpGetVal("#ddlPrioridadeCab"));
	        }
			
			tpParam.AddParams('PS2_CODSOL', $(tpSelector("#ddlSolicitante")).val());
			tpParam.AddParams('PS2_COND',   tpGetVal('#ddlCondPag'));
			tpParam.AddParams('PS2_CODCOM', $(tpSelector("#ddlComprador")).val());
			tpParam.AddParams('PS2_OBSPGT', $(tpSelector("#txtObsPagto")).val());
			tpParam.AddParams('PS2_TPFRET', $(tpSelector("#ddlFrete")).val());
			tpParam.AddParams('PS2_VLFRET', tpGetVal("#txtValorFrete"));
			tpParam.AddParams('PS2_VLSEGU', tpGetVal("#txtValorSeguro"));
			
			// Adicionando o valor do contato, verificando se foi o input de texto ou o select que tinha valor
			if(!empty(tpGetVal("#txtContato"))) {
			    tpParam.AddParams('PS2_CONTAT', tpGetVal("#txtContato"));
			    tpParam.AddParams('PS2_CODCON', '');
			} else if(!empty(tpGetVal("#ddlContato")) && scmFichaPrePedido.habilitaContatoFornecedor == "S") {
			    tpParam.AddParams('PS2_CONTAT', $("#ddlContato option:selected").text().split("-")[1].trim());
			    tpParam.AddParams('PS2_CODCON', tpGetVal("#ddlContato"));
			}
			
			tpParam.AddParams('PS2_OBSPRE', $(tpSelector("#txtObsPre")).val());
			tpParam.AddParams('PS2_JUSTIF', $(tpSelector("#PS2_JUSTIF")).val());
			tpParam.AddParams('PS2_OBSFOR', $(tpSelector("#PS2_OBSFOR")).val());
			tpParam.AddParams('PS2_PEDREF', $(tpSelector("#hdPedidoPai")).val());
			tpParam.AddParams('PS2_MOEDA',  $(tpSelector("#ddlMoeda")).val());
			tpParam.AddParams('PS2_LOCAL',  $(tpSelector("#ddlLocal")).val());
			
			if(getTetrisParams("SCM_HABILITA_IMPOSTOS_FICHA_PREPEDIDO") == 'S'){
            	tpParam.AddParams('PS2_PIS'     ,   tpGetVal('#PS2_PIS'));
    			tpParam.AddParams('PS2_COFINS'  ,   tpGetVal('#PS2_COFINS'));
    			tpParam.AddParams('PS2_CSLL'    ,   tpGetVal('#PS2_CSLL'));
    			tpParam.AddParams('PS2_IR'      ,   tpGetVal('#PS2_IR'));
    			tpParam.AddParams('PS2_INSS'    ,   tpGetVal('#PS2_INSS'));
    			tpParam.AddParams('PS2_ISS'     ,   tpGetVal('#PS2_ISS'));
    		}
            if (scmFichaPrePedido.habilitaBaseImposto == "S"){
    		    tpParam.AddParams('PS2_BSPIS'   ,   tpGetVal('#PS2_BSPIS'));
    			tpParam.AddParams('PS2_BSCOFI'  ,   tpGetVal('#PS2_BSCOFI'));
    			tpParam.AddParams('PS2_BSCSLL'  ,   tpGetVal('#PS2_BSCSLL'));
    			tpParam.AddParams('PS2_BSIRRF'  ,   tpGetVal('#PS2_BSIRRF'));
    			tpParam.AddParams('PS2_BSINSS'  ,   tpGetVal('#PS2_BSINSS'));
    			tpParam.AddParams('PS2_BSISS'   ,   tpGetVal('#PS2_BSISS'));
    		}
    	
            scmFichaPrePedido.nSalvarDinamico = $(tpSelector('.valorCondPag')).length;
    
            var idInputDinamicoVenc     = 0;
            var idInputDinamicoParc     = 0;
            var nInputDinamicoValor     = 0;
            var parcelas                = [];
            var idInputDinamicoGerPa    = "";
            var idInputDinamicoAnexoPa  = "";
            if(scmFichaPrePedido.defineModeloCondPag == 'S'){
                // Esse tratamento de somente 9 parcelas precisa ser descontinuado, porem tem vinculo com a integração usando esse formato.
                for (var J = 0; J < 9; J++) {
                    if ( J < scmFichaPrePedido.nSalvarDinamico ) {
                        idInputDinamicoVenc = $(tpSelector('.venc'))[J].id; 
                        idInputDinamicoParc = $(tpSelector('.nValorParc'))[J].id; 
                        
                        tpParam.AddParams(`PS2_VALOR${J + 1}` , parseFloat(tpGetVal('#' + idInputDinamicoParc)));
                        tpParam.AddParams(`PS2_VENC${J + 1}` , tpGetVal('#' + idInputDinamicoVenc) );
                        
                        parcelas.push({
                           VALOR: parseFloat(tpGetVal('#' + idInputDinamicoParc)),
                           VENC: tpGetVal('#' + idInputDinamicoVenc)
                        });
                    } else {
                        tpParam.AddParams(`PS2_VALOR${J + 1}` , 0);
                        tpParam.AddParams(`PS2_VENC${J + 1}` , '');
                    }
                
                }
            } else{    
                for (var J = 0; J < scmFichaPrePedido.nSalvarDinamico; J++) {
                    idInputDinamicoVenc     = $('.venc')[J].id; 
                    idInputDinamicoParc     = $('.nValorParc')[J].id; 
                    
                    parcelas.push({
                        VALOR:  parseFloat(tpGetVal('#' + idInputDinamicoParc)),
                        VENC:   tpGetVal('#' + idInputDinamicoVenc),
                    });
                    
                    if(scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C'){
                        idInputDinamicoGerPa    = $('.pa')[J].id; 
                        idInputDinamicoAnexoPa  = $('.anexopa')[J].id; 
                        parcelas[J].GERAPA      = tpGetVal('#' + idInputDinamicoGerPa)
                        parcelas[J].ANEXO       = tpGetVal('#' + idInputDinamicoAnexoPa).replaceAll('|', ';')
                    }
                }
                
                //FORMA DE PAGAMENTO PARCELA
                var oCfgFormaPagamento = scmFichaPrePedido_montaConfigFormaPagamento();
                tpParam.AddParams('PS2_CFGPAG', oCfgFormaPagamento);
		    }    
                
            tpParam.AddParams('PS2_PARCE' , parcelas.length > 0 ? JSON.stringify(parcelas) : '');
   
			tpParam.AddParams('PS2_NFNUM',  tpGetVal('#PS2_NFNUM'));
			tpParam.AddParams('PS2_NFSERI', tpGetVal('#PS2_NFSERI'));
			tpParam.AddParams('PS2_IDPSM',  tpGetVal('#PS2_IDPSM'));
			tpParam.AddParams('PS2_NFEMIS', tpGetVal('#PS2_NFEMIS'));
			tpParam.AddParams('PS2_NFVENC', tpGetVal('#PS2_NFVENC'));
			tpParam.AddParams('PS2_NFANEX', tpGetVal('#PS2_NFANEX'));
			tpParam.AddParams('PS2_ESPECI', tpGetVal('#PS2_ESPECI'));
			tpParam.AddParams('PS2_CHVNFE', tpGetVal('#PS2_CHVNFE'));
			tpParam.AddParams('PS2_UFORIG', tpGetVal('#PS2_UFORIG'));
            tpParam.AddParams('PS2_MUNORG', tpGetVal('#PS2_MUNORG'));
            tpParam.AddParams('PS2_UFDEST', tpGetVal('#PS2_UFDEST'));
            tpParam.AddParams('PS2_MUNDST', tpGetVal('#PS2_MUNDST'));
            tpParam.AddParams('PS2_TPCTE' , tpGetVal('#PS2_TPCTE'));
            tpParam.AddParams('PS2_TXMOED', tpGetVal('#txMoeda').valor());
			tpParam.AddParams('PS2_XNATUR', tpGetVal('#txtNatureza'));
			tpParam.AddParams('PS2_ENTOBR', tpGetVal("#ddlEntObra"));
			tpParam.AddParams('PS2_DESPES', tpGetVal("#txtValorDespesa"));
			tpParam.AddParams('PS2_ANXXML', tpGetVal('#PS2_ANXXML'));
			tpParam.AddParams('PS2_LOCFAT', tpGetVal('#ddlLocalFaturamento'));
			tpParam.AddParams('PS2_INCOTE', tpGetVal("#PS2_INCOTE"));
		
			if(scmFichaPrePedido.habilitaGrpAprova == "S"){
		    	tpParam.AddParams('PS2_APROV', tpGetVal('#ddlGrupoAprov'));
            }
            
			tpParam.AddParams('PS2_APRVCP', tpGetVal("#PS2_APRVCP"));
			tpParam.AddParams('PS2_EMIPED', tpGetVal("#txtEmissao"));
			tpParam.AddParams('PS2_EMAIL' , $(tpSelector("#txtEmail")).val());
			tpParam.AddParams('PS2_FOLWUP', $(tpSelector("#ddlTipoFollowUp")).val());

			if( $('#PS2VINC').val() == 'S'){
			    var cContrato = tpGetVal("#PS2_NUMCON").split('/')[0]
			    tpParam.AddParams('PS2_NUMCON', cContrato.split('-')[0].trim())
			    tpParam.AddParams('PS2_REVCON', cContrato.split('-')[1])
			}
            // Dados do Contrato de Parceria
    		tpParam.AddParams('PS2_XGESTO', tpGetVal("#PS2_XGESTO"));
    		tpParam.AddParams('PS2_APRCON', tpGetVal("#PS2_APRCON"));
    		tpParam.AddParams('PS2_VIGINI', tpGetVal("#PS2_VIGINI"));
    		tpParam.AddParams('PS2_VIGFIM', tpGetVal("#PS2_VIGFIM"));
    		tpParam.AddParams('PS2_TPCON' , tpGetVal("#PS2_TPCON"));
    		tpParam.AddParams('PS2_CUMULA', tpGetVal('#PS2_CUMULA'));
    		tpParam.AddParams('PS2_DTRENO', tpGetVal('#PS2_DTRENO'));
    		tpParam.AddParams('PS2_DTLREN', tpGetVal('#PS2_DTLREN'));
    		tpParam.AddParams('PS2_DAVIRE', tpGetVal('#PS2_DAVIRE'));
    		tpParam.AddParams('PS2_LIMCAN', tpGetVal('#PS2_LIMCAN'));
    		tpParam.AddParams('PS2_TOLERA', tpGetVal('#PS2_TOLERA'));
    		tpParam.AddParams('PS2_AVPERC', tpGetVal('#PS2_AVPERC'));
            tpParam.AddParams('PS2_OBSCON', tpGetVal('#PS2_OBSCON'));
            if(tpGetVal('#PS2_MODALI') == 'A' && scmFichaPrePedido.aData.length > 0){
                var cRecorrencias = '';
                scmFichaPrePedido.aData.forEach((data, index) =>{
                    cRecorrencias += data.PS2_ITEM + '|' + tpGetVal(`#PS2_DESDOB_${data.PS2_ITEM}`) + '|' + (tpGetVal(`#PS2_QTDDES_${data.PS2_ITEM}`) || '0') + '|' + (tpGetVal(`#PS2_DIA_${data.PS2_ITEM}`) || '0');
                    
                    if((scmFichaPrePedido.aData.length - 1) != index){
                        cRecorrencias += ';'
                    }
                })
            }
            tpParam.AddParams('RECORENCIAS', cRecorrencias );
			
			if(existBlock(typeof scmFichaPrePedidoPE_save)){
                scmFichaPrePedidoPE_save(ACAO);
            }
            
		}
		else {
			/**
			 * Campos ACAO == 'I' || ACAO == 'A'
			 * PS2_NUM, PS2_ITEM, PS2_PRODUT, PS2_DESC, PS2_QUANT, PS2_PRECO, 
			 * PS2_VALIPI, PS2_UM, PS2_DTENTR, PS2_TOTAL, PS2_CODSOL, PS2_CC, 
			 * PS2_CODCOM, PS2_FILENT, PS2_FINALI, PS2_GRUPO, PS2_OBS, PS2_PRZA
			 */
            var PS2_PRODUT = '';
            var PS2_DESC   = '';
			var ddlProdutos = $(tpSelector('#ddlProdutos')).select2('data');
			
			if (ddlProdutos != null) {
			    if(ddlProdutos.id != '') {
				    PS2_PRODUT = ddlProdutos.text.split(' - ')[0]; /* B1_COD */ 
			        
			        if(ddlProdutos.text.split(' - ').length <= 2){
    				    PS2_DESC   = ddlProdutos.text.split(' - ')[1]; /* B1_DESC */ 
			        }
			        else{
			            PS2_DESC   = ddlProdutos.text.split(' - ')[1].trim() + ' - ' + ddlProdutos.text.split(' - ')[2].trim() /* B1_DESC */ 
			        }
			    }
			    else if(ddlProdutos.text.trim() != '-') {
			        PS2_PRODUT = '';
			        PS2_DESC   = ddlProdutos.text;       
			    }
			}
			
			if (getTetrisParams('SCM_DEFINE_MESMA_PRIORIDADE_ITENS_SC', 'SCM') == 'S'){
			    tpParam.AddParams('PS2_PRZA',   tpGetVal("#ddlPrioridadeCab"));
			}else{
			    tpParam.AddParams('PS2_PRZA',   tpGetVal('#ddlPrioridade'));
	        }
			  
            if(getTetrisParams('UTILIZA_TIPO_SC') == 'S'){
                
                tpParam.AddParams('PS2_IDPSN', tpGetVal('PS2_IDPSN').split('|')[0])
           
                if(empty(tpGetVal(tpSelector('#txtObsevaçãoTipoSC')))) {
                    
                    tpParam.AddParams('PS2_XOBS', "");
                    $(tpSelector('#contentObsTipoSc')).attr('hidden', true);
                    
                } else {
                    
                    tpParam.AddParams('PS2_XOBS', tpGetVal('txtObsevaçãoTipoSC'));
                    $(tpSelector('#contentObsTipoSc')).attr('hidden', false);
                    
                }
                
            } 

			tpParam.AddParams('PS2_ITEM',   $(tpSelector("#txtNumeroItem")).val());
			tpParam.AddParams('PS2_PRODUT', PS2_PRODUT);
			tpParam.AddParams('PS2_DESC',   scmFichaPrePedido.habilitaDescricaoSubst != 'S' ? PS2_DESC : $(tpSelector("#ddlSubDesc")).val());
			tpParam.AddParams('PS2_CODSOL', $(tpSelector("#ddlSolicitante")).val());
			tpParam.AddParams('PS2_COND',   tpGetVal("#ddlCondPag"));
			tpParam.AddParams('PS2_CODCOM', $(tpSelector("#ddlComprador")).val());
			tpParam.AddParams('PS2_FILENT', tpGetVal("#ddlEntregar"));
			tpParam.AddParams('PS2_GRUPO',  tpGetVal("#ddlGrupoProduto"));
			tpParam.AddParams('PS2_QUANT',  $(tpSelector("#txtQtde")).val().valor());
			tpParam.AddParams('PS2_UM',     $(tpSelector("#txtUnidade")).val());
			tpParam.AddParams('PS2_PRECO',  $(tpSelector("#txtValor")).val().valor());
			tpParam.AddParams('PS2_VLDESC', $(tpSelector("#txtValorDesc")).val().valor());
			tpParam.AddParams('PS2_LOCAL',  $(tpSelector("#ddlLocal")).val());
			tpParam.AddParams('PS2_IPI',    $(tpSelector("#txtIPI")).val().valor());
			tpParam.AddParams('PS2_VALIPI', $(tpSelector("#txtValorIPI")).val().valor());
			tpParam.AddParams('PS2_ICMST',  $(tpSelector("#txtValorICMSST")).val().valor());
			tpParam.AddParams('PS2_ICMDA',  $(tpSelector("#txtValorDifal")).val().valor());
			tpParam.AddParams('PS2_BASICM', $(tpSelector("#txtBaseICMS")).val().valor());
			tpParam.AddParams('PS2_ALQICM', $(tpSelector("#txtICMS")).val().valor());
			tpParam.AddParams('PS2_VLICMS', $(tpSelector("#txtValorICMS")).val().valor());
			tpParam.AddParams('PS2_BASPIS', $(tpSelector("#txtBasePIS")).val().valor());
			tpParam.AddParams('PS2_ALQPIS', $(tpSelector("#txtPIS")).val().valor());
			tpParam.AddParams('PS2_VLPIS',  $(tpSelector("#txtValorPIS")).val().valor());
			tpParam.AddParams('PS2_BASCOF', $(tpSelector("#txtBaseCOF")).val().valor());
			tpParam.AddParams('PS2_ALQCOF', $(tpSelector("#txtCOF")).val().valor());
			tpParam.AddParams('PS2_VLCOF',  $(tpSelector("#txtValorCOF")).val().valor());
			tpParam.AddParams('PS2_CLASSI', $(tpSelector("#ddlClassificacao")).val());	/* O Valor Total já está sendo calculado no UPDPS2 */
			tpParam.AddParams('PS2_DTENTR', $(tpSelector("#txtDtEntrega")).val().CTOS());
			tpParam.AddParams('PS2_OBS',    $(tpSelector("#txtObs")).val());
			tpParam.AddParams('PS2_OBSMEM', $(tpSelector("#txtObservacaoMemo")).val());
			tpParam.AddParams('PS2_EMITEN', $(tpSelector("#ddlEmitente")).val());
			tpParam.AddParams('PS2_IDPSM',  tpGetVal('#PS2_IDPSM'));
			tpParam.AddParams('PS2_EMIPED', tpGetVal("#txtEmissao"));
			tpParam.AddParams('PS2_CODPLA', getSelect2(tpSelector("#ddlPlanOrc")));
			tpParam.AddParams('PS2_CO',     getSelect2(tpSelector("#ddlContaOrc")));
			tpParam.AddParams('PS2_XNATUR', tpGetVal("#txtNatureza"));
			tpParam.AddParams('PS2_ENTOBR', tpGetVal("#ddlEntObra"));
			
			if(scmFichaPrePedido.habilitaCampoOrdemProd){
			    tpParam.AddParams('PS2_OP'   , getSelect2(tpSelector("#ddlOP")));
			}
			
			if(scmFichaPrePedido.habilitaProjeto == 'S'){
        	    tpParam.AddParams('PS2_PROJET', getSelect2(tpSelector('#ddlProjeto')).split(' - ')[0]);
        	}	    
        	if(scmFichaPrePedido.habilitaCampoRevisao == 'S'){
        	    tpParam.AddParams('PS2_REVISA', getSelect2(tpSelector('#ddlProjeto')).split(' - ')[1]);
        	}
        	if(scmFichaPrePedido.habilitaCampoTarefa == 'S'){
        	    tpParam.AddParams('PS2_TAREFA', getSelect2(tpSelector('#ddlTarefa')));
        	}
        	
        	if(scmFichaPrePedido.habilitaComexImportacao == 'S'){
        	    tpParam.AddParams('PS2_MODAL', tpGetVal('#ddlModalTransporte'));
        	    tpParam.AddParams('PS2_INCOTE', tpGetVal('#ddlIncoterms'));
        	    tpParam.AddParams('USACOMEX', scmFichaPrePedido.habilitaComexImportacao);
        	}

			tpParam.AddParams('PS2_CONTA',      tpGetVal("#PS2_CONTA"));
			tpParam.AddParams('PS2_CC',         tpGetVal("#ddlCentroCusto"));
			tpParam.AddParams('PS2_ITEMCT',     tpGetVal('#PS2_ITEMCT'));
			tpParam.AddParams('PS2_CLVL',       tpGetVal('#PS2_CLVL'));
			tpParam.AddParams('PS2_XNATUR',     tpGetVal("#txtNatureza"));
			tpParam.AddParams('PS2_ENTOBR', tpGetVal("#ddlEntObra"));
			
			if(scmFichaPrePedido.habilitaGrpAprova == "S"){
		    	tpParam.AddParams('PS2_APROV', tpGetVal('#ddlGrupoAprov'));
            }
			
			if(scmFichaPrePedido.habilitaCamposVerba){
				tpParam.AddParams('PS2_YVERBA', 	getSelect2(tpSelector('#ddlVerba')));
			}

			if(scmFichaPrePedido.habilitaCampoOrcamento){
				tpParam.AddParams('PS2_ORCA', 	getSelect2(tpSelector('#ddlOrcamento')));
			}
        	
        	if(scmFichaPrePedido.habilitaCamposRastreia == "S" ){
				tpParam.AddParams('PS2_RASTRE', getSelect2(tpSelector('#ddlRastreia')));
			}
			
            if(scmFichaPrePedido.habilitaPlacaChassi == "S" ){
				tpParam.AddParams('PS2_XPLACA', tpGetVal('#PS2_XPLACA'));
			}
			
            if(scmFichaPrePedido.habilitaCampoVencimento){
				var PS2_VENFAT = $(tpSelector('#ddlVencimento')).val();
				if(!strIsVoid(PS2_VENFAT)){
					PS2_VENFAT = PS2_VENFAT.CTOS();
				}
				tpParam.AddParams('PS2_VENFAT', 	PS2_VENFAT);
			}

			/* Campos Tipo Solicitante OEM */
			tpParam.AddParams('PS2_TPMAN',   $(tpSelector("#ddlTipoManutencao")).val());
			tpParam.AddParams('PS2_TPEQUI',  $(tpSelector('#ddlTipoEquipamento')).val());
			tpParam.AddParams('PS2_NATURE',  $(tpSelector("#ddlNatureza")).val());
			tpParam.AddParams('PS2_CAPITA',  $(tpSelector("#ddlCapitalizar")).val());
            tpParam.AddParams('PS2_MOEDA',   $(tpSelector("#ddlMoeda")).val());
            tpParam.AddParams('PS2_RATEIO',  !empty(rateio_geral) ? 'S' : 'N');
            tpParam.AddParams('PS2_MRATEI',  !empty(rateio_geral) ? JSON.stringify(rateio_geral) : '');
            tpParam.AddParams('TABPRECO',  getTetrisParams("HABILITA_TABELA_PRECO_PRE_PEDIDO","SCM"));
            tpParam.AddParams('PS2_ANEXOS', tpGetVal("#txtAnexos"));
            
            if(existBlock(typeof scmFichaPrePedidoPE_save)){
                scmFichaPrePedidoPE_save(ACAO);
            }
            else {
                // $(tpSelector('#divPS2_IDPSN')).attr('hidden', true);
                // $(tpSelector('#contentObsTipoSc')).attr('hidden', true);
            }
            
            if(getTetrisParams("SCM_HABILITA_TES_FICHA_PREPEDIDO") == 'S'){
                tpParam.AddParams('PS2_TES',   tpGetVal('TES'));
            }   
		}
    
        tpParam.AddParams('PS2_MODALI', tpGetVal("#PS2_MODALI") );
        
        //Dados de Contrato
        tpParam.AddParams('PS2_DSCCON', tpGetVal("#PS2_DSCCON") );
        tpParam.AddParams('PS2_TPCTO',  tpGetVal("#PS2_TPCTO") );
        tpParam.AddParams('PS2_VIGE',   formatNumber(tpGetVal("#PS2_VIGE"),2) );
        tpParam.AddParams('PS2_UNVIGE', tpGetVal("#PS2_UNVIGE") );
        tpParam.AddParams('PS2_FLGRES', tpGetVal("#PS2_FLGRES") );
        tpParam.AddParams('PS2_INDICE', tpGetVal("#PS2_INDICE") );
        tpParam.AddParams('PS2_FLGCAU', tpGetVal("#PS2_FLGCAU") );
        tpParam.AddParams('PS2_TPCAU',  tpGetVal("#PS2_TPCAU") );
        tpParam.AddParams('PS2_MINCAU', formatNumber(tpGetVal("#PS2_MINCAU"),2) );
        tpParam.AddParams('PS2_OBJCTO', tpGetVal("#PS2_OBJCTO") );
        tpParam.AddParams('PS2_ALTCLA', tpGetVal("#PS2_ALTCLA") );
        tpParam.AddParams('PS2_TIPPLA', tpGetVal("#PS2_TIPPLA") );
        tpParam.AddParams('PS2_PEDTII', tpGetVal("#PS2_PEDTII") );
        
		tpParam.AddParams('PS2_UFORIG', tpGetVal('#PS2_UFORIG'));
        tpParam.AddParams('PS2_MUNORG', tpGetVal('#PS2_MUNORG'));
        tpParam.AddParams('PS2_UFDEST', tpGetVal('#PS2_UFDEST'));
        tpParam.AddParams('PS2_MUNDST', tpGetVal('#PS2_MUNDST'));
        tpParam.AddParams('PS2_ENVPED', tpGetVal('#PS2_ENVPED'));
        tpParam.AddParams('PS2_COPCOM', tpGetVal('#PS2_COPCOM'));
        tpParam.AddParams('PS2_COPSOL', tpGetVal('#PS2_COPSOL'));
        tpParam.AddParams('PS2_AVISO' , tpGetVal('#PS2_AVISO'));
        tpParam.AddParams('PS2_TPCTE' , tpGetVal('#PS2_TPCTE'));
        tpParam.AddParams('PS2_TXMOED', tpGetVal('#txMoeda').valor());
        tpParam.AddParams('USAPROTHEUS',  getTetrisParams('SCM_USA_PROTHEUS','SCM'));
		tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

        
		// Dados do Contrato de Parceria
		tpParam.AddParams('PS2_XGESTO', tpGetVal("#PS2_XGESTO"));
		tpParam.AddParams('PS2_APRCON', tpGetVal("#PS2_APRCON"));
		tpParam.AddParams('PS2_VIGINI', tpGetVal("#PS2_VIGINI"));
		tpParam.AddParams('PS2_VIGFIM', tpGetVal("#PS2_VIGFIM"));
		tpParam.AddParams('PS2_TPCON' , tpGetVal("#PS2_TPCON"));
		tpParam.AddParams('PS2_CUMULA', tpGetVal('#PS2_CUMULA'));
		tpParam.AddParams('PS2_DTRENO', tpGetVal('#PS2_DTRENO'));
		tpParam.AddParams('PS2_DTLREN', tpGetVal('#PS2_DTLREN'));
		tpParam.AddParams('PS2_DAVIRE', tpGetVal('#PS2_DAVIRE'));
		tpParam.AddParams('PS2_LIMCAN', tpGetVal('#PS2_LIMCAN'));
		tpParam.AddParams('PS2_TOLERA', tpGetVal('#PS2_TOLERA'));
		tpParam.AddParams('PS2_AVPERC', tpGetVal('#PS2_AVPERC'));
        tpParam.AddParams('PS2_OBSCON', tpGetVal('#PS2_OBSCON'));
        

        tpParam.AddParams('PS2_KM'    ,  parseFloat(tpGetVal('txtKM') || 0, 2));
        tpParam.AddParams('PS2_HORIM' ,  parseFloat(tpGetVal('txtHorimetro') || 0, 2));
        tpParam.AddParams('PS2_TRANSP', tpGetVal('#ddlTransportadora'));
        tpParam.AddParams('PS2_FRMPAG', tpGetVal('ddlFormaPag'));
        tpParam.AddParams('PS2_RESPON', tpGetVal('#PS2_RESPON'));
		tpParam.AddParams('PS2_XINFGE', tpGetVal('#PS2_XINFGE'));
		tpParam.AddParams('PS2_XRETEC', tpGetVal('#PS2_XRETEC'));

		var oDados = tpParam.SendFormPost('UPDPS2');

		if (oDados.errorcode == "00") {
        	$(tpSelector('#btnNovoItem')).show();
        	$(tpSelector('#btnAdicionarItem')).hide();
        	$(tpSelector('#btnsEdicao')).hide();
// 			$(tpSelector('#btnFinalizar')).show();

			if (ACAO == 'I') {
				var PS2_NUM = oDados.content;
				
				if (new RegExp("[0-9]{6}").test(PS2_NUM)) {
				    $(tpSelector("#txtNumPrePedido")).val(PS2_NUM);
    				scmFichaPrePedido_itens_createGrid(PS2_NUM);
    				// bootbox.alert(decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')));
    			
				}
			}
			
	        		
			//ALTERAÇÃO ALI 01/04/2020 -> RATEIO CORREÇÃO(LIMPAR DADOS VARIAVEL GLOBAL)
            scmRateio.dadosRateio                       = null;
            scmFichaPrePedido.dados_rateio_cc           = null;
            scmFichaPrePedido.dados_rateio_conta        = null;
            scmFichaPrePedido.dados_rateio_item_conta   = null;
            scmFichaPrePedido.dados_rateio_classe_valor = null;
            scmFichaPrePedido.dados_rateio_geral        = null;
			
			if (ACAO == 'S') {
			    if(scmFichaPrePedido.gerarPed == 'N'){
			        bootbox.alert(decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')) ? decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')) : "Pre Pedido Alterado com Sucesso");
			    }
			    else if(scmFichaPrePedido.gerarPed == 'S'){
			         //bootbox.alert("Pedido gerado com sucesso");
			    }
			    
			    
			    // ATUALIZA AMARRACAO PRODUTO X FORNECEDOR
            	if (!empty(numPre) && !empty(PS2_FORNEC)){
            	    let saveSA5 = scmFichaPrePedido_salvaProdPTC(numPre);
                    if(!saveSA5){
                        $(tpSelector('#btnFinalizarAguarde')).hide();
            	        $(tpSelector('#btnFinalizar')).show();
            	        hideLoader();
            	        return;
            	    }
            	}
			    
			    
			    
    			return true
			}
			
			if(ACAO == 'A'){
			    scmFichaPrePedido_itens_createGrid($(tpSelector("#txtNumPrePedido")).val());
				return true;
			}
			
			if(ACAO == 'I'){
			    scmFichaPrePedido_calculaImpostos('F');
			}
		}
		else {
			bootbox.alert(decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')));
			return false
		}
	}
	else {
	    return false;
	}
	
	scmFichaPrePedido_cancelarInclusaoItem();
	
	if (!$(tpSelector('#txtEmissao')).val()) $(tpSelector('#txtEmissao')).val(moment().format('DD/MM/YYYY'));
}


function scmFichaPrePedido_btnAdicionar() {
    
    if( getTetrisParams("SCM_MODIFICA_BUSCA_VERBA") == 'AK2' ){
        
        // if( tpGetVal('ddlPlanOrc') == '' || tpGetVal('txtValorTotalItem') == '' ){
            
            scmFichaPrePedido_save('I'); 
        // } else {
            
        //     //Verificar se possui um orçamento vinculado e se possui verba disponivel
        //     scmFichaPrePedido_verificarOrcamento( tpGetVal('ddlPlanOrc'), toSendNumber($('#txtValorTotalItem').val()) )
        // }

    }else {
        
        //fluxo normal para pre-pedido sem orçamento vinculado
        scmFichaPrePedido_save('I');    
    }
    
    
	
}

function scmFichaPrePedido_voltar() {
	/*if (!strIsVoid(scmFichaPrePedido.callbackVoltar)) {
		eval(scmFichaPrePedido.callbackVoltar);
		scmFichaPrePedido.callbackVoltar = "";
	}
	else {
		//TPnavclick('scmLstPrePedido.html #conteudo', '#content', 'scmLstPrePedido_createGrid() ');
		TPnavclick('scmLstPrePedido.html #conteudo', '#content', 'scmLstPrePedido_init() ');
	}*/
	TPnavClose(false);
}

function scmFichaPrePedido_formataObsTipoSC() {
    var objTipoSC = tpConvert.b64ToObj(tpGetVal('PS2_IDPSN', 'dataB64'));
    
    if(!empty(tpGetVal('PS2_IDPSN').split('|')[1])){
        tpSetVal(tpSelector('#txtObsevaçãoTipoSC'), tpGetVal('PS2_IDPSN').split('|')[1].trim());
    } else {
        tpSetVal(tpSelector('#txtObsevaçãoTipoSC'), "");
    }
    
    if(empty(objTipoSC.PSN_MSG)) {
        tpSetVal(tpSelector('#txtObsevaçãoTipoSC'), "");
        $(tpSelector('#contentObsTipoSc')).attr('hidden', true);
    } else {
        $(tpSelector('#contentObsTipoSc')).attr('hidden', false);
    }
	if(scmFichaPrePedido.habilitaRegraTipoSC == 'S') {
        $($(tpSelector('#btnsInclusao'))).show();
            
        if(!empty(tpGetVal('PS2_IDPSN').split('|')[2])) {
            
            if( empty(scmFichaPrePedido.aData) ){
                scmFichaPrePedido_exibirFormularioNaDiv(tpGetVal('PS2_IDPSN').split('|')[2].trim());
                    
                $("#divItemPrePedido").hide();
                $("#divItemFormDinamico").show();
            }
            // if(scmFichaPrePedido.ACAO == 'I') {
            //     setTimeout(function() {
            //         $(tpSelector('#divItemFormDinamico')).append($(tpSelector('#btnAdicionarItem')));
            //     }, 10);
            // }
            
        }else{
            $("#divItemFormDinamico").hide();
            // $("#divItemPrePedido").show();
            
            if(scmFichaPrePedido.ACAO == "I"){
				$("#divItemPrePedido").show();	
			}
        }
	}
}

//----------------FIM DA FUNÇÃO SALVAR NOVO REGISTRO--------------------

/* Alterar um Item do Pré-Pedido */
function scmFichaPrePedido_btnAlterarItem() {
	scmFichaPrePedido_save('A');
}

function scmFichaPrePedido_itens_btnAlteracao(data, type, full, meta) {
	if (scmFichaPrePedido.data.PS2_STATUS != '001' &&  scmFichaPrePedido.data.PS2_STATUS != '003' ) {	
		return '';
	}
	else {
		var fnc = "scmFichaPrePedido_itens_editarItem('" + data.PS2_NUM + "','" + data.PS2_ITEM + "');";
		var coluna = '<a title="Editar Registro" onclick="' + fnc + '" >';
		coluna += '   <i class="' + GetIcone('UPDATE') + '"></i>Alterar';
		coluna += '</a>';
		return coluna;
	}
}

function scmFichaPrePedido_itens_editarItem(codNum, codItem) {
    scmFichaPrePedido.dados_rateio_pco  = [];
    scmFichaPrePedido.resetItem();

    scmFichaPrePedido_ddlProdutos();
	
	if(getTetrisParams("SCM_OCULTA_IMPOSTOS_FICHA_PREPEDIDO_ITEM") == 'S'){
        $(tpSelector('#txtIPI')).parent().parent().hide();
        $(tpSelector('#txtValorIPI')).parent().parent().hide();
        $(tpSelector('#txtValorICMSST')).parent().parent().hide();
        $(tpSelector('#txtValorDifal')).parent().parent().hide();
        $(tpSelector('#txtBaseICMS')).parent().parent().hide();
        $(tpSelector('#txtICMS')).parent().parent().hide();
        $(tpSelector('#txtValorICMS')).parent().parent().hide();
        $(tpSelector('#txtBasePIS')).parent().parent().hide();
        $(tpSelector('#txtPIS')).parent().parent().hide();
        $(tpSelector('#txtValorPIS')).parent().parent().hide();
        $(tpSelector('#txtBaseCOF')).parent().parent().hide();
        $(tpSelector('#txtCOF')).parent().parent().hide();
        $(tpSelector('#txtValorCOF')).parent().parent().hide();
    }
    
	
    if(getTetrisParams("SCM_HABILITA_TES_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#divTES')).attr('hidden', false);
    }
    
    $(tpSelector('#labelCTD')).html(scmCore_nomeEntidade('CTD'));
    $(tpSelector('#labelCTH')).html(scmCore_nomeEntidade('CTH')); 
    $(tpSelector('#labelCTT')).html(scmCore_nomeEntidade('CTT'));
    $(tpSelector('#labelAK1')).html(scmCore_nomeEntidade('AK1'));
    $(tpSelector('#labelAK3')).html(scmCore_nomeEntidade('AK3'));
    
    if ( !empty(scmFichaPrePedido.nomeLocalEntrega) ) {
        $(tpSelector('#labelLocalEnt')).html(scmFichaPrePedido.nomeLocalEntrega);
    }
    
	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM017');
	tpParam.AddParams('PS2_NUM', codNum);
	tpParam.AddParams('PS2_ITEM', codItem);
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

    if(scmFichaPrePedido.habilitaRegraTipoSC == "S") {
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: , MEMO(PS2_RESPF) AS PS2_RESPF, PSN_FORM, PSN_GRUPO');
    }else{
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: ');
    }
	
	if(existBlock(typeof scmFichaPrePedidoPE_itens_camposCustom)){
	    scmFichaPrePedidoPE_itens_camposCustom();
	}

	var oDados = tpParam.SendFormPost('WSGETCONS');

	if (oDados.errorcode == '00') {
        showLoader();
		scmFichaPrePedido.item.persistir(oDados);

		var aData = ajustaraData(oDados);
		var data = aData[0];
		var comprador = scmBuscaComprador(usuarioLogado.codigoUsuario());

        if(scmFichaPrePedido.habilitaRegraTipoSC == "S"){
            if(!empty(tpGetVal('PS2_IDPSN').split('|')[2])) {
                if( !empty( data.PS2_RESPF ) ) {
                    scmFichaPrePedido_alterarItemForm(data);
                    hideLoader();
                    return
                }
            }
        }

        tpSetVal('ddlEntregar', data.PS2_FILENT);
        if(getTetrisParams("SCM_HABILITA_TES_FICHA_PREPEDIDO") == 'S'){
            tpSetVal('#TES', data.PS2_TES);
        }	
        
        scmFichaPrePedido_getRateioPorEntContabil( data.PS2_NUM, data.PS2_ITEM )
        	if(getTetrisParams('UTILIZA_TIPO_SC') == 'S') {
    		tpSetVal('PS2_IDPSN', data.PS2_IDPSN + "|" + data.PSN_MSG);
    		
    		if(!empty(data.PS2_XOBS)) {
    		    tpSetVal('txtObsevaçãoTipoSC', data.PS2_XOBS.trim());
    		}
		}
	
		/* Tab - Itens Pré-Pedido */
		$(tpSelector('#tituloItemPrePedido')).html('Alterar Item Pré-Pedido');
		$(tpSelector("#txtNumPrePedido")).val(data.PS2_NUM);
		$(tpSelector("#txtNumeroItem")).val(data.PS2_ITEM);
		$(tpSelector("#PS2_ITEM")).val(data.PS2_ITEM);
		
        $(tpSelector('#ddlSolicitante')).val(data.PS2_CODSOL);
		$(tpSelector('#ddlSolicitante')).attr('tpcallback', "$(tpSelector('#ddlSolicitante')).val('" + data.PS2_CODSOL + "');scmFichaPrePedido_ajustarLayout();");
        
        if (empty(tpGetVal('#ddlComprador'))) {
            var codComprador = usuarioLogado.comprador();
            if(strIsVoid(codComprador)){
                codComprador = "";
            }
            setSelect(tpSelector("#ddlComprador"), codComprador.trim());
        }
		
		
		//setSelect('#ddlEntregar',data.PS2_FILENT.trim())
		scmFichaPrePedido_initDdlLocalEntrega( data.PS2_FILENT, data.PS4_DESC );
		
        if(getTetrisParams('FIXA_LOCAL_DE_ENTREGA') == 'S') {
		    $(tpSelector('#ddlEntregar')).attr('disabled', true);
		}
		
		tpSetVal('#ddlGrupoProduto', data.PS2_GRUPO, data.PS2_GRUPO.trim() + ' - ' + data.BM_DESC);
		setSelect(tpSelector('#ddlClassificacao'),  data.PS2_CLASSI);
	
		if (data.PS2_TIPOPC.trim() == '2'){ //TIPO PEDIDO AE
		    $(tpSelector("#ddlProdutos")).select2('disable');
		}
		
		
		tpSetVal('#ddlCentroCusto',  data.PS2_CC.trim(),data.PS2_CC.trim() + ' - ' + data.CTT_DESC01.trim());
		setSelect2(tpSelector('#ddlPlanOrc'),   data.PS2_CODPLA.trim(),data.PS2_CODPLA.trim() + ' - ' +data.AK1_DESCRI.trim() );
		setSelect2(tpSelector('#ddlContaOrc'),  data.PS2_CO.trim()    ,data.PS2_CO.trim() + ' - ' + data.AK5_DESCRI.trim() );
		setSelect2(tpSelector('#PS2_TIPPLA'),  data.PS2_TIPPLA.trim()    ,data.PS2_TIPPLA.trim() + ' - ' + data.CNL_DESCRI.trim() );
		
// 		ALTERADO DO CONTROLE DE PARAMETRO PARA O CONTROLE A NÍVEL DE COMPRADOR 22/07/2021
	    if(comprador.Y1_XEDQUPP !== 'S'){
		    $(tpSelector('#txtQtde')).attr('disabled',true);
	    }
	    
// 		ALTERADO DO CONTROLE DE PARAMETRO PARA O CONTROLE A NÍVEL DE COMPRADOR 22/07/2021	     
        if(comprador.Y1_XEDPRPP !== 'S'){
		    $(tpSelector("#ddlProdutos")).select2('disable');
	    }
	    
	    if(scmFichaPrePedido.habilitaCamposRastreia == "S"){           
           	tpSetVal('#PS2_RASTRE'   , data.PS2_RASTRE);
    	    }
		if(scmFichaPrePedido.habilitaDescricaoSubst == "S"){
		    $(tpSelector('#ddlSubDesc')).val(data.PS2_DESC ? data.PS2_DESC.trim() : '');
		}
		
		if(strIsVoid(data.PS2_PRODUT)){
		    setSelect2(tpSelector('#ddlProdutos'), '', data.PS2_DESC);
		}
		else {
		    setSelect2(tpSelector('#ddlProdutos'), data.PS2_PRODUT.trim(), data.PS2_PRODUT.trim() + ' - ' + data.PS2_DESC);
		}
            
        tpSetVal("ddlLocal",data.PS2_LOCAL,data.PS2_LOCAL + ' - '+ data.NNR_DESCRI);

		$(tpSelector("#txtQtde")).val(formatNumber(data.PS2_QUANT.trim(), 2));
		tpSetVal("#txtUnidade", data.PS2_UM);
		$(tpSelector("#txtValor")).val(formatNumber(data.PS2_PRECO.trim(), getTetrisParams("VALOR_MASK","SCM")));
		$(tpSelector("#txtValorDesc")).val(formatNumber(data.PS2_VLDESC.trim(), 2));
		$(tpSelector("#txtValorTotal")).val(formatNumber(data.PS2_TOTAL.trim(), 2));
		$(tpSelector("#txtIPI")).val(formatNumber(data.PS2_IPI.trim(), 2));
		$(tpSelector("#txtValorIPI")).val(formatNumber(data.PS2_VALIPI.trim(), 2));
		$(tpSelector("#txtValorICMSST")).val(formatNumber(data.PS2_ICMST.trim(), 2));
		$(tpSelector("#txtValorDifal")).val(formatNumber(data.PS2_ICMDA.trim(), 2));
		$(tpSelector("#txtBasePIS")).val(formatNumber(data.PS2_BASPIS.trim(), 2) );
		$(tpSelector("#txtPIS")).val(formatNumber(data.PS2_ALQPIS.trim(), 2) );
		$(tpSelector("#txtValorPIS")).val(formatNumber(data.PS2_VLPIS.trim(), 2) );
		$(tpSelector("#txtBaseCOF")).val(formatNumber(data.PS2_BASCOF.trim(), 2) );
		$(tpSelector("#txtCOF")).val(formatNumber(data.PS2_ALQCOF.trim(), 2) );
		$(tpSelector("#txtValorCOF")).val(formatNumber(data.PS2_VLCOF.trim(), 2) );
		$(tpSelector("#txtBaseICMS")).val(formatNumber(data.PS2_BASICM.trim(), 2) );
		$(tpSelector("#txtICMS")).val(formatNumber(data.PS2_ALQICM.trim(), 2) );
		$(tpSelector("#txtValorICMS")).val(formatNumber(data.PS2_VLICMS.trim(), 2) );														   
		$(tpSelector("#txtDtEntrega")).val(data.PS2_DTENTR.STOC());
		$(tpSelector("#txtObs")).val(data.PS2_OBS.trim());
		$(tpSelector("#txtObservacaoMemo")).val(data.PS2_OBSMEM.trim());
	    $(tpSelector("#ddlEmitente")).val(data.PS2_EMITEN);
		$(tpSelector("#txtAnexos")).val(data.ANEXOS.trim()).TPAnexo('');
		$(tpSelector('#txtEmissao')).val(data.PS2_EMIPED.STOC());

		/*
		if(scmFichaPrePedido.habilitaCamposProjeto){
			setSelect2('#ddlProjeto',       data.PS2_PROJET, data.PS2_PROJET);
			setSelect2('#ddlTarefa',        data.PS2_TAREFA, data.PS2_TAREFA);
			setSelect2('#ddlRevisao',       data.PS2_REVISA, data.PS2_REVISA);
		}*/
		if(scmFichaPrePedido.habilitaProjeto == 'S'){
    	    setSelect2(tpSelector('#ddlProjeto'),       data.PS2_PROJET + ' - ' + data.PS2_REVISA, data.PS2_PROJET + ' - ' + data.AF8_DESCRI);
    	    scmFichaPrePedido_aplicarSelecaoProjeto()
    	}	    
    	if(scmFichaPrePedido.habilitaCampoTarefa == 'S'){
    	    setSelect2(tpSelector('#ddlTarefa'),        data.PS2_TAREFA, data.PS2_TAREFA);
    	    scmFichaPrePedido_initDdlTarefa(data.PS2_TAREFA)
    	}
    	if(scmFichaPrePedido.habilitaCampoRevisao == 'S'){
    	    setSelect2(tpSelector('#ddlRevisao'),       data.PS2_REVISA, data.PS2_REVISA);
    	}
    	
    	if(scmFichaPrePedido.habilitaComexImportacao == 'S'){
    	    $(tpSelector('#ddlModalTransporte')).val(data.PS2_MODAL.trim());
    	    $(tpSelector('#ddlIncoterms')).val(data.PS2_INCOTE.trim());
        }
	
	//Comentado pois estava limpando o campo depois que havia sido preenchido
    // 	if(scmFichaPrePedido.habilitaGrpAprova == "S"){
    //         //scmFichaPrePedido_initddlGrpAprov();
    //         scmFichaPrePedido_ddlGrupoAprovacao();
    // 	}
		
        tpSetVal('#PS2_CONTA'   , data.PS2_CONTA, data.PS2_CONTA.trim() + ' - ' + data.CT1_DESC01   );
		tpSetVal('#PS2_CLVL'    , data.PS2_CLVL, data.PS2_CLVL.trim() + ' - ' + data.CTH_DESC01  );
		tpSetVal('#PS2_ITEMCT'  , data.PS2_ITEMCT, data.PS2_ITEMCT.trim() + ' - ' + data.CTD_DESC01  );

		if(scmFichaPrePedido.habilitaCamposVerba){
		    $(tpSelector('#ddlVerba')).select2();
		    $(tpSelector('#ddlVerba')).select2('enable', false);
		    
		   // $('#ddlVerba').html(`<option value="${data.PS2_YVERBA.trim()}">${data.AK6_CODIGO.trim() + " - " + data.AK6_DESCRI.trim()}</option>`);
			setSelect2(tpSelector('#ddlVerba'), data.PS2_YVERBA);
		}

		if(scmFichaPrePedido.habilitaCampoOrcamento){
			setSelect2(tpSelector('#ddlOrcamento'), data.PS2_ORCA);
		}
		
		if(scmFichaPrePedido.habilitaCampoOrdemProd == 'S'){
			scmFichaPrePedido_ddlOP();
			setSelect2(tpSelector('#ddlOP'), data.PS2_OP, data.PS2_OP + ' - ' + data.PS2_PRODOP.trim() + ' - ' + data.PS2_DESCOP.trim() );
		}

		if(scmFichaPrePedido.habilitaCampoVencimento){
			if(!strIsVoid(data.PS2_VENFAT)){
				$(tpSelector('#ddlVencimento')).val(data.PS2_VENFAT.STOC());
			}
		}
		
		if(scmFichaPrePedido.habilitaPlacaChassi == 'S'){
            tpSetVal('#PS2_XPLACA', data.PS2_XPLACA.trim());  
        }
		
		if(getTetrisParams('UTILIZA_TIPO_SC') == 'S'){
                
            tpParam.AddParams('PS2_IDPSN', tpGetVal('PS2_IDPSN').split('|')[0])
        
            if(empty(tpGetVal(tpSelector('#txtObsevaçãoTipoSC')))) {
                
                tpParam.AddParams('PS2_XOBS', "");
                $(tpSelector('#contentObsTipoSc')).attr('hidden', true);
                
            } else {
                
                tpParam.AddParams('PS2_XOBS', tpGetVal('txtObsevaçãoTipoSC'));
                $(tpSelector('#contentObsTipoSc')).attr('hidden', false);
                
            }
            
        } else {
            //	$('#btnNovoItem').show();
        	//$('#PS2_IDPSN').show();
            
            $(tpSelector('#divPS2_IDPSN')).attr('hidden', true);
            $(tpSelector('#contentObsTipoSc')).attr('hidden', true);
        }

		if(existBlock(typeof scmFichaPrePedidoPE_alterar)){
            scmFichaPrePedidoPE_alterar(oDados);
        }
		
		scmFichaPrePedido_editarItemPrePedido();
		scmFichaPrePedido_desabilitaCamposListagemItens();
		scmFichaPrePedido_calcularValorTotal()
// 		scmFichaPrePedido_itens_createGrid($(tpSelector("#txtNumPrePedido")).val(), 'scmFichaPrePedido_desabilitaCamposListagemItens();');
        hideLoader()
		
	}else{ 
	       toastr.error(`Erro ao carregar dados, consulte administrador  do sistema`)
	    
	    
	}
}

/* Get - Preencher o Pré Pedido */
function scmFichaPrePedido_get(codNum, codItem, cAcao, cEmpFil, acoes) {
    scmFichaPrePedido.defineDtLancamento = scmCore_retornaValorParametro('SCM_DEFINE_DT_LIBERA_LANCAMENTO_PD_SP') || '01/01/2000'
	$(tpSelector('#PS2_XGESTO')).select2();
	scmFichaPrePedido_ddlGrupoAprovacaoCP();
	scmFichaPrePedido_carregaMoedas('')
	
	
	if(getTetrisParams('SCM_HABILITA_RATEIO_PCO', 'SCM') == 'S' ) {
        $(tpSelector('#rateioPCO')).show();
        scmFichaPrePedido.dados_rateio_pco = [];
    }
	
    scmFichaPrePedido.EMPFIL_ADHOC = cEmpFil
    $($(tpSelector('#ddlComprador')).siblings()[0]).text(getTetrisParams('ENTIDADE_COMPRADOR'))
        
    if(getTetrisParams("SCM_HABILITA_IMPOSTOS_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#divIMPOSTOS')).css('display', 'block');
    }
    
    if(getTetrisParams("SCM_OCULTA_SOLICITANTE_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#ddlSolicitante')).parent().parent().css('display', 'none');
    }
    
    if(getTetrisParams("SCM_OCULTA_EMAIL_E_CONTATO_FICHA_PREPEDIDO") == 'S'){
        $(tpSelector('#txtContato')).parent().parent().css('display', 'none');
        $(tpSelector('#txtEmail')).parent().parent().css('display', 'none');
    }
	if (acoes == "S") {
        $(tpSelector('#divBtnPrePedido #divAcoesCP')).show();
        $(tpSelector('#divBtnPrePedido #divBtnSalvar')).hide();
        $(tpSelector('#divBtnPrePedido #divBtnFinalizar')).hide();
    }
    
    var comprador = scmBuscaComprador(usuarioLogado.codigoUsuario());
    
    showLoader();
    
    scmFichaPrePedido.resetPrePed();
    
    scmFichaPrePedido.ACAO = cAcao;
    
    //TRATATIVA DE DECIMAIS DA QUANTIDADE
    /*if(getTetrisParams("SCM_DECIMAL_QUANTIDADE") == "4"){
        $('#txtQtde').unmask()
        $('#txtQtde').removeClass('VALOR2');
        $('#txtQtde').removeAttr('tpmask');
        $('#txtQtde').addClass('VALOR4');
        allPages();
    	   
    }else if(getTetrisParams("SCM_DECIMAL_QUANTIDADE") == "6"){
        $('#txtQtde').unmask()
        $('#txtQtde').removeClass('VALOR2');
        $('#txtQtde').removeAttr('tpmask');
        $('#txtQtde').addClass('VALOR6');
        allPages();
    }*/
    
    scmFichaPrePedido.editandoRegistro = true;
    
	scmFichaPrePedido.objSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
	
	scmFichaPrePedido_habilitaCamposParametrizados();

	scmFichaPrePedido_ddlFornecedor();
	scmFichaPrePedido_ddlProdutos();
	
	if(scmFichaPrePedido.habilitaCampoLocal == 'S') {
        scmFichaPrePedido_ddlLocal();
    }
	/*
	if(scmFichaPrePedido.habilitaCamposProjeto){
		scmFichaPrePedido_initDdlProjeto(scmFichaPrePedido.objSolicitante.PSH_CC);
		scmFichaPrePedido_initDdlTarefa();
		scmFichaPrePedido_initDdlRevisao();
	}*/
	if(scmFichaPrePedido.habilitaProjeto == 'S'){
    	scmFichaPrePedido_initDdlProjeto(scmFichaPrePedido.objSolicitante.PSH_CC);
    }	    
    if(scmFichaPrePedido.habilitaCampoRevisao == 'S'){
    	scmFichaPrePedido_initDdlTarefa();
    }
    if(scmFichaPrePedido.habilitaCampoTarefa == 'S'){
    	scmFichaPrePedido_initDdlRevisao();
    }

    if(scmFichaPrePedido.habilitaGrpAprova == "S"){
    	//scmFichaPrePedido_initddlGrpAprov();
    	scmFichaPrePedido_ddlGrupoAprovacao();
    }
    
    if(getTetrisParams('SCM_HABILITA_RATEIO', 'SCM') == 'S') {
        if(getTetrisParams('SCM_EXIBE_RATEIO_GERAL', 'SCM') == 'S') {
            $(tpSelector('#divBtnRateioGeral')).attr('hidden', false);
        }else{
            $(tpSelector('#rateioCC')).attr('hidden', false);
            $(tpSelector('#rateioConta')).attr('hidden', false);
            $(tpSelector('#rateioItemConta')).attr('hidden', false);
            $(tpSelector('#rateioClasseValor')).attr('hidden', false);
        }
        scmFichaPrePedido.dados_rateio_cc           = [];
        scmFichaPrePedido.dados_rateio_conta        = [];
        scmFichaPrePedido.dados_rateio_item_conta   = [];
        scmFichaPrePedido.dados_rateio_classe_valor = [];
        scmFichaPrePedido.dados_rateio_geral        = [];
    }
	
// 	ALTERADO DO CONTROLE DE PARAMETRO PARA O CONTROLE A NÍVEL DE COMPRADOR 22/07/2021
    if(comprador.Y1_XEDIAPP !== 'S'){
        $(tpSelector('#btnNovoItem')).remove();
 	    $(tpSelector('#btnAdicionarItem')).remove();
    }
	
	if ( scmFichaPrePedido.habilitaAdiantamento == 'S'){
	    $(tpSelector('#divAdiantamento')).show();
	} else {
	    $(tpSelector('#divAdiantamento')).hide();
	}
	
	if ( scmFichaPrePedido.habilitaAnexo == 'S'){
        $(tpSelector('#divAnexo')).show();        
    } else {
        $(tpSelector('#divAnexo')).hide();        
    }

	scmFichaPrePedido_cancelarEdicaoItem();
    
    $(tpSelector('#ddlEmitente')).attr("disabled", true);
    
    $(tpSelector('#PS2_MODALI')).select2();
    $(tpSelector('#PS2_UNVIGE')).select2();
    $(tpSelector('#PS2_ENVPED')).select2();
    $(tpSelector('#PS2_COPCOM')).select2();
    $(tpSelector('#PS2_COPSOL')).select2();
    $(tpSelector('#PS2_AVISO')).select2();
    $(tpSelector('#PS2_FLGRES')).select2();
    $(tpSelector('#PS2_FLGCAU')).select2();
    $(tpSelector('#PS2_TPCAU')).select2();
    $(tpSelector('#PS2_PEDTII')).select2();
    tpSetVal('#PS2_MODALI', 'P', 'Pedido de Compra');
    if(getTetrisParams('SCM_EXIBE_CONTRATO_SC_PRE_PEDIDO', 'SCM') == 'S') {
        $(tpSelector('#divPS2_MODALI')).attr('hidden', false);
        $(tpSelector('#divDadosContrato')).attr('hidden', false);
        $(tpSelector('#divItensContrato')).attr('hidden', false);
        $(tpSelector('#divEnviaEmail')).attr('hidden', true);
        
        if (getTetrisParams('SCM_MODALIDADE_PADRAO_SC_PRE_PEDIDO') == "C"){
            tpSetVal('#PS2_MODALI', 'C', 'Contrato');
            $(tpSelector('#divAdiantamento')).attr('hidden', true);
            $(tpSelector('#divDocumentos')).attr('hidden', true);
        }
        
        scmFichaPrePedido_changePS2_MODALI();
    }

	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA'	, 'SCM017');
	tpParam.AddParams('PS2_NUM'		, codNum);
	tpParam.AddParams('PS2_ITEM'	, 'ALL');
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
	
    if(scmFichaPrePedido.habilitaRegraTipoSC == "S") {
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: , MEMO(PS2_RESPF) AS PS2_RESPF, PSN_FORM, PSN_GRUPO, MEMO(PS2_BOLANX) AS PS2_BOLANX');
    }else{
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: ');
    }
	
	if(existBlock(typeof scmFichaPrePedidoPE_itens_camposCustom)){
	    scmFichaPrePedidoPE_itens_camposCustom();
	}

	var oDados = tpParam.SendFormPost('WSGETCONS');

	scmFichaPrePedido.persistir(oDados);

	if (oDados.errorcode == '00') {

		var aData = ajustaraData(oDados);
		var data = aData[0];
		
	    scmFichaPrePedido.aData = aData

        /* Cabecalho Pre Pedido */
		if (!empty(data.PS2_PEDREF.trim())) {
			scmFichaPrePedido_setCodPai(data.PS2_PEDREF);
		}
        
		$(tpSelector("#txtNumPrePedido")).val(data.PS2_NUM);
		$(tpSelector("#txtEmissao")).val(data.PS2_EMIPED.STOC());
		
		//if(getTetrisParams('UTILIZA_TIPO_SC') == 'S') {
    	//	tpSetVal('PS2_IDPSN', data.PS2_IDPSN + "|" + data.PSN_MSG);
    		
    	//	if(!empty(data.PS2_XOBS)) {
    	//	    tpSetVal('txtObsevaçãoTipoSC', data.PS2_XOBS.trim());
    	//	}
		//}

		try {
		    
		    // Verifica se o fornecedor que foi passado é generico ou cadastrado
		    if (!empty(data.PS2_FORNEC)) {
    			var cVal = data.PS2_FORNEC + '/' + data.PS2_LOJA;
    			var cTxt = data.PS2_FORNEC + '/' + data.PS2_LOJA + ' - ';
    			cTxt    += data.PS2_FORDES.trim().includes('CNPJ') ? data.PS2_FORDES.trim() : ( data.PS2_FORDES.trim() + ' (CNPJ:'+data.A2_CGC+')' ) ;
    			cTxt    += ' - UF:'+data.A2_EST + ' MUN: '+data.A2_MUN;    
    			setSelect2(tpSelector('#ddlFornecedor'), cVal, cTxt);
		    } else {
		        var cVal = "";
    			var cTxt = data.PS2_FORDES.trim()
    			setSelect2(tpSelector('#ddlFornecedor'), cVal, cTxt);
		    }
		}
		catch (e) { }
		
		$(tpSelector('#ddlTipoFollowUp')).select2();

		setSelect(tpSelector('#ddlComprador'),   data.PS2_CODCOM.trim());
		setSelect(tpSelector('#ddlEmitente'),    data.PS2_EMITEN.trim());
	
		scmFichaPrePedido.contrato = data.PS2_NUMCON.trim() +'-' + data.PS2_REVCON.trim() + '/' + data.PS2_NUMCON+data.PS2_REVCON+data.CNA_NUMERO+data.CNB_PEDTIT
		if( data.PS2_TIPOPC.trim() == '2' && empty(data.PS2_CODSOL)){
		    let infoSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
		    tpSetVal('#ddlSolicitante', infoSolicitante.PSH_ID, infoSolicitante.PSH_NOME)
		}else{
		    tpSetVal('#ddlSolicitante',    data.PS2_CODSOL);
		}
  
		tpSetVal('#PS2_DSCCON',    data.PS2_DSCCON);

		$('#PS2_NUMCON').attr('tpcallback', `setSelect2('#PS2_NUMCON', '${ scmFichaPrePedido.contrato}')`);
	
		if( !empty(data.PS2_NUMCON) ){
		    tpSetVal('#PS2VINC','S')
		}
		
		tpSetVal('#PS2_DSCCON',    data.PS2_DSCCON);

       // tpSetVal('ddlEntregar', data.PS2_CODSOL );
        tpSetVal('ddlEntregar', data.PS2_FILENT);
        scmFichaPrePedido.grupoAprov = data.PS2_APROV;

		/* Tab - Condições de Fornecimento */
		tpSetVal('#ddlCondPag', data.PS2_COND, data.PS2_COND.trim() + ' - ' + data.E4_DESCRI);
		scmFichaPrePedido_mostralinkApuracao()

		$(tpSelector("#txtObsPagto")).val(data.PS2_OBSPGT);
		setSelect(tpSelector('#ddlFrete'),       data.PS2_TPFRET);
		
        tpSetVal('#ddlMoeda',       data.PS2_MOEDA.trim() );
	
	    scmFichaPrePedido_onchangeMoeda()
        $(tpSelector("#txMoeda")).val(formatNumber(data.PS2_TXMOED.trim(), getTetrisParams("VALOR_DECIMAL_MASK_TAXA_MOEDA","SCM")));
	    
	    // Condicional para ver se o codigo de contato existe, assim definindo um contato existente e retornando o input select com as opções de contato do fornecedor
	    if(empty(data.PS2_CODCON)) {
		    $(tpSelector("#txtContato")).val(data.PS2_CONTAT.trim());
		    $('#txtContato').parent().show();
            $('#ddlContato').parent().hide();
            $("#ddlContato").empty();
            $('#divBtnMaisContato').hide();
            if(cAcao == "V") {
                tpDisable("#txtContato")
            }
	    } else if(scmFichaPrePedido.habilitaContatoFornecedor == "S"){
		    scmFichaPrePedido_atualizarContatos(tpUtil.getVal(tpSelector('#ddlFornecedor')).split('/')[0], tpUtil.getVal(tpSelector('#ddlFornecedor')).split('/')[1], data.PS2_CODCON)
	        $('#ddlContato').parent().show();
            $('#divBtnMaisContato').show();
            $('#txtContato').parent().hide();
            $("#txtContato").val("");
            if(cAcao == "V") {
                tpDisable("#ddlContato")
                $('#divBtnMaisContato').hide();
                $('#linkCadastroCliente').hide();
            }
	    }
		
		$(tpSelector("#txtEmail")).val(data.PS2_EMAIL);
		$(tpSelector("ddlTipoFollowUp")).val(data.PS2_FOLWUP.trim())
		$(tpSelector("#txtObsPre")).val(data.PS2_OBSPRE);
		$(tpSelector("#PS2_JUSTIF")).val(data.PS2_JUSTIF);
		$(tpSelector("#PS2_OBSFOR")).val(data.PS2_OBSFOR.trim());
		$(tpSelector("#txtTipoPedido")).val(data.PS2_TIPOPC.trim())
		
		if (data.PS2_TIPOPC.trim() == '2'){ //TIPO PEDIDO AE
		    disableSelect(tpSelector('#ddlFornecedor'));
		    tpEnable("#optAutEnt")
		    $(tpSelector("#ddlCondPag")).attr("disabled", true);
		    $(tpSelector('#btnNovoItem')).remove();
		}
		
		 tpSetVal('ddlEntregar', data.PS2_FILENT);

         
	    tpSetVal('#ddlPrioridadeCab',      data.PS2_PRZA);
        tpSetVal('#ddlPrioridade',         data.PS2_PRZA);
    
        tpSetVal('txtKM'        , data.PS2_KM);
        tpSetVal('txtHorimetro' , data.PS2_HORIM);
        tpSetVal('#ddlFormaPag', data.PS2_FRMPAG, data.PS2_FRMPAG.trim() + ' - ' + data.PTN_DESC);
        
		/* Campos Tipo Solicitante OEM */
		tpSetVal('#txtNumContrato' , data.PS2_CONTRA);
		$(tpSelector('#ddlTipoManutencao')).val(data.PS2_TPMAN);
		setSelect(tpSelector('#ddlTipoEquipamento'), data.PS2_TPEQUI);
		$(tpSelector('#ddlNatureza')).val(data.PS2_NATURE);
		$(tpSelector('#ddlCapitalizar')).val(data.PS2_CAPITA);
		tpSetVal('#PS2_IDPSM',data.PS2_IDPSM);
		tpSetVal('#PS2_NFNUM',data.PS2_NFNUM);
		tpSetVal('#PS2_NFSERI',data.PS2_NFSERI);
		tpSetVal('#PS2_NFEMIS',data.PS2_NFEMIS);
		tpSetVal('#PS2_NFVENC',data.PS2_NFVENC);
		tpSetVal('#PS2_NFANEX',data.PS2_NFANEX);
		tpSetVal('#PS2_ESPECI',data.PS2_ESPECI,(empty(data.PS2_ESPECI) ? '' : data.PS2_ESPECI.trim() + ' - ' + data.ESPECIE));

		scmFichaPrePedido_changeDdlEspecie()
		
		tpSetVal('#PS2_CHVNFE',data.PS2_CHVNFE);
		tpSetVal('#PS2_UFORIG' , data.PS2_UFORIG, (empty(data.PS2_UFORIG) ? '' : data.PS2_UFORIG ) );
        tpSetVal('#PS2_UFDEST' , data.PS2_UFDEST, (empty(data.PS2_UFDEST) ? '' : data.PS2_UFDEST ) );
        tpSetVal('#PS2_TPCTE',data.PS2_TPCTE);
        
        tpSetVal('#ddlTransportadora',data.PS2_TRANSP.trim());
        scmFichaPrePedido.transportadora = data.PS2_TRANSP.trim()
        scmFichaPrePedido_ddlTransportadora();
		if(cAcao == "V") {
            tpDisable("#ddlTransportadora");
        }
		
		
		if (!empty(data.PS2_UFORIG)){
		    $(tpSelector('#PS2_UFORIG')).attr('tpcallback', `tpSetVal('#PS2_UFORIG', '${data.PS2_UFORIG}', '${data.PS2_UFORIG}')`);
		}
		if (!empty(data.PS2_UFDEST)){
            $(tpSelector('#PS2_UFDEST')).attr('tpcallback', `tpSetVal('#PS2_UFDEST', '${data.PS2_UFDEST}', '${data.PS2_UFDEST}')`);
		}
        
		
		scmFichaPrePedido_ddlMunicipio( '#PS2_MUNORG', '#PS2_UFORIG', data.PS2_UFORIG)
        scmFichaPrePedido_ddlMunicipio( '#PS2_MUNDST', '#PS2_UFDEST', data.PS2_UFDEST)
        tpSetVal('#PS2_MUNORG' , data.PS2_MUNORG.trim(), (empty(data.PS2_MUNORG.trim()) ? '' : data.PS2_MUNORG.trim() + ' - ' + data.MUNORG.trim() ) );
        tpSetVal('#PS2_MUNDST' , data.PS2_MUNDST.trim(), (empty(data.PS2_MUNDST.trim()) ? '' : data.PS2_MUNDST.trim() + ' - ' + data.MUNDST.trim() ) );
		
		$(tpSelector('#PS2_ANXXML')).val(data.PS2_ANXXML ? data.PS2_ANXXML : '').TPAnexo('',  {acceptFileTypes		: 'xml', btnLabel: 'XML NFe'});

        
		if(getTetrisParams("SCM_HABILITA_IMPOSTOS_FICHA_PREPEDIDO") == 'S'){
            tpSetVal('PS2_PIS'     ,  data.PS2_PIS);
    		tpSetVal('PS2_COFINS'  ,  data.PS2_COFINS);
    		tpSetVal('PS2_CSLL'    ,  data.PS2_CSLL);
    		tpSetVal('PS2_IR'      ,  data.PS2_IR);
    		tpSetVal('PS2_INSS'    ,  data.PS2_INSS);
    		tpSetVal('PS2_ISS'     ,  data.PS2_ISS);
        }
        if ( scmFichaPrePedido.habilitaBaseImposto == 'S'){
            tpSetVal('PS2_BSPIS'   ,  data.PS2_BSPIS);
    		tpSetVal('PS2_BSCOFI'  ,  data.PS2_BSCOFI);
    		tpSetVal('PS2_BSCSLL'  ,  data.PS2_BSCSLL);
    		tpSetVal('PS2_BSIRRF'  ,  data.PS2_BSIRRF);
    		tpSetVal('PS2_BSINSS'  ,  data.PS2_BSINSS);
    		tpSetVal('PS2_BSISS'   ,  data.PS2_BSISS);
        }
        
        if(scmFichaPrePedido.habilitaComexImportacao == 'S'){
        	 tpSetVal('#ddlModalTransporte', data.PS2_MODAL)
        	 tpSetVal('#ddlIncoterms', data.PS2_INCOTE)
        }
		
		tpSetVal('#ddlEntObra',data.PS2_ENTOBR);
		tpSetVal('#txtNatureza', data.PS2_NATURE.trim(), data.PS2_NATURE.trim() + ' - ' + data.ED_DESCRIC)
		
		if ( data.PS2_OBSREP.trim() != '' ){
		    $(tpSelector("#divObsRejeicao")).show();
		    $(tpSelector("#txtObsRejeicao")).val(data.PS2_OBSREP);
		}

        scmFichaPrePedido_somaTotais() ;
    
        //DADOS CONTRATO
        var cUnidVigen = (data.PS2_UNVIGE == "D" ? "Dias" :
                         (data.PS2_UNVIGE == "M" ? "Meses" :
                         (data.PS2_UNVIGE == "A" ? "Anos" :
                         (data.PS2_UNVIGE == "I" ? "Indeterminada" : "" ) ) ) )
            
        var cModali = ( data.PS2_MODALI == "C" ? "Contrato" : 
                      ( data.PS2_MODALI == "P" || data.PS2_TIPOPC.trim() == "2" ? 
                            ( data.PS2_TIPOPC.trim() == "2" ? "Autorização de Entrega" :  "Pedido de Compra" ) : "" ) ) 
            
        var cFlgRes = ( data.PS2_FLGRES == "S" ? "Sim" : 
                      ( data.PS2_FLGRES == "N" ? "Não" : "" ) )
                          
        var cFlgCau = ( data.PS2_FLGCAU == "S" ? "Sim" : 
                      ( data.PS2_FLGCAU == "N" ? "Não" : "" ) )
            
        var cTpCau = ( data.PS2_TPCAU == "M" ? "Manual" : 
                     ( data.PS2_TPCAU == "R" ? "Retenção" : "" ) )
                         
        var cPedTit = ( data.PS2_PEDTII == "N" ? "Nota Fiscal" :
                      ( data.PS2_PEDTII == "T" ? "Título" : "" ) )
                      
        var cEnvMail = ( data.PS2_ENVPED == "S" ? "Sim" : 
                      ( data.PS2_ENVPED == "N" ? "Não" : "" ) )
            
        var cCopCom = ( data.PS2_COPCOM == "S" ? "Sim" : 
                      ( data.PS2_COPCOM == "N" ? "Não" : "" ) )
        
        var cCopSol = ( data.PS2_COPSOL == "S" ? "Sim" : 
                      ( data.PS2_COPSOL == "N" ? "Não" : "" ) )

        var cAutFat = ( data.PS2_AVISO == "S" ? "Sim" : 
                      ( data.PS2_AVISO == "N" ? "Não" : "" ) )

        tpSetVal("#PS2_ENVPED", data.PS2_ENVPED, cEnvMail );
        tpSetVal("#PS2_COPCOM", data.PS2_COPCOM, cCopCom );
        tpSetVal("#PS2_COPSOL", data.PS2_COPSOL, cCopSol );  
        tpSetVal("#PS2_AVISO" , data.PS2_AVISO, cAutFat );  
        
        if (data.PS2_ENVPED == "N"){
            tpSetVal("#PS2_COPCOM", "N", "Não" );
            tpSetVal("#PS2_COPSOL", "N", "Não" );  
            
            tpDisable("#PS2_COPCOM" );
            tpDisable("#PS2_COPSOL" );
        }
        
        setSelect2(tpSelector("#PS2_MODALI"), data.PS2_MODALI.trim(), cModali );
        tpSetVal("#PS2_DSCCON",   data.PS2_DSCCON );
        tpSetVal("#PS2_TPCTO",  data.PS2_TPCTO,  data.PS2_TPCTO.trim() + ' - ' + data.CN1_DESCRI.trim() );
        tpSetVal("#PS2_VIGE",   data.PS2_VIGE );
        tpSetVal("#PS2_UNVIGE", data.PS2_UNVIGE, cUnidVigen );
        tpSetVal("#PS2_FLGRES", data.PS2_FLGRES, cFlgRes );
        tpSetVal("#PS2_INDICE", data.PS2_INDICE, data.PS2_INDICE.trim() + ' - ' + data.CN6_DESCRI.trim() );
        tpSetVal("#PS2_FLGCAU", data.PS2_FLGCAU, cFlgCau );
        tpSetVal("#PS2_TPCAU",  data.PS2_TPCAU,  cTpCau );
        tpSetVal("#PS2_MINCAU", data.PS2_MINCAU );
        tpSetVal("#PS2_OBJCTO", data.PS2_OBJCTO );
        tpSetVal("#PS2_ALTCLA", data.PS2_ALTCLA );
        tpSetVal("#PS2_PEDTII", data.PS2_PEDTII, cPedTit );
        tpSetVal("ddlLocalFaturamento", data.PS2_LOCFAT.trim());
        
        $('#PS2_TPCTO').attr('tpcallback', `setSelect2('#PS2_TPCTO', '${data.PS2_TPCTO}')`);
        $('#PS2_INDICE').attr('tpcallback', `setSelect2('#PS2_INDICE', '${data.PS2_INDICE}')`);
            
        scmFichaPrePedido_changePS2_MODALI();
        
		scmFichaPrePedido_itens_createGrid(data.PS2_NUM);
		scmFichaPrePedido_listaAdiantamento();
		if(scmFichaPrePedido.ACAO == 'V'){
		    scmFichaPrePedido_atualizaTotalViaGet();
		}
		
		//scmFichaPrePedido_renderStatusPrePedido(data.PS2_STATUS);

		if (data.PS2_STATUS == '002' && cAcao !== "V") {
	    	$(tpSelector('#divAnexo')).hide();
	    	$(tpSelector('#divDocumentos')).hide();
		}

		if(cAcao == "V"){
			scmFichaPrePedido_disableForm();
            $(tpSelector("#PS2_COPCOM")).select2('disable');
            $(tpSelector("#PS2_COPSOL")).select2('disable');
            $(tpSelector('#editarPs9_forn')).hide(); 
            $(tpSelector('#divBtnIncluirF')).hide();
		}

		if(data.PS2_STATUS != "001"){
			$(tpSelector("#btnNovoItem")).hide();
		}
		
		 setTimeout(function() {
		
            if( scmFichaPrePedido.defineModeloCondPag == 'S'){
                scmFichaPrePedido.dadosPS2 = [
                    {"VALOR": data.PS2_VALOR1,  "VENC": data.PS2_VENC1},   {"VALOR": data.PS2_VALOR2,      "VENC": data.PS2_VENC2},
            		{"VALOR": data.PS2_VALOR3,  "VENC": data.PS2_VENC3},   {"VALOR": data.PS2_VALOR4,      "VENC": data.PS2_VENC4},
            		{"VALOR": data.PS2_VALOR5,  "VENC": data.PS2_VENC5},   {"VALOR": data.PS2_VALOR6,      "VENC": data.PS2_VENC6},
            		{"VALOR": data.PS2_VALOR7,  "VENC": data.PS2_VENC7},   {"VALOR": data.PS2_VALOR8,      "VENC": data.PS2_VENC8},
            		{"VALOR": data.PS2_VALOR9,  "VENC": data.PS2_VENC9}
                ]
            } else{
                scmFichaPrePedido_preparaParcelas(data.PS2_PARCE.trim())
                var dataFormaPag = scmFichaPrePedido_getCfgFormaPagamento(data.PS2_CFGPAG.trim())	
                
                scmFichaPrePedido.dadosPS2.forEach((el, index) =>{
                    el.PS2_FORMPG = dataFormaPag[`PS2_FORMPG${padZero((index + 1), 2)}`];
                    el.PS2_CODBAR = dataFormaPag[`PS2_CODBAR${padZero((index + 1), 2)}`];
                    el.PS2_CHVPIX = dataFormaPag[`PS2_CHVPIX${padZero((index + 1), 2)}`];
                    el.PS2_FINALI = dataFormaPag[`PS2_FINALI${padZero((index + 1), 2)}`];
                    el.PS2_CODBAN = dataFormaPag[`PS2_CODBAN${padZero((index + 1), 2)}`];
                    el.PS2_AGENC  = dataFormaPag[`PS2_AGENC${padZero((index + 1), 2)}`];
                    el.PS2_CONTCC = dataFormaPag[`PS2_CONTCC${padZero((index + 1), 2)}`];
                    el.PS2_CGCTI  = dataFormaPag[`PS2_CGCTI${padZero((index + 1), 2)}`];
                    el.PS2_NOMETI = dataFormaPag[`PS2_NOMETI${padZero((index + 1), 2)}`];
                    el.PS2_BOLJUR = dataFormaPag[`PS2_BOLJUR${padZero((index + 1), 2)}`];
                    el.PS2_BOLMUL = dataFormaPag[`PS2_BOLMUL${padZero((index + 1), 2)}`];
					el.PS2_BANDES = dataFormaPag[`PS2_BANDES${padZero((index + 1), 2)}`];
																	 
                })
            }    
    
            scmFichaPrePedido_chamaParcelasPC()
            								 
        } , 1000);
        
		if (data.PS2_TIPOPC.trim() == '2'){ //TIPO PEDIDO AE
		    scmFichaPrePedido_habilitaFormAE();
		    $(tpSelector("#divContrato")).show();
		}
		
		$(tpSelector('#PS2_APRCON')).attr('tpcallback', `tpSetVal('#PS2_APRCON', '${data.PS2_APRCON}')`);
		$(tpSelector('#PS2_APRVCP')).attr('tpcallback', `tpSetVal('#PS2_APRVCP', '${data.PS2_APRVCP.trim()}')`);
		scmFichaPrePedido_initDllAprovadores()
		
		tpSetVal('#PS2_APRCON' , data.PS2_APRCON);
		tpSetVal('#PS2_XGESTO' , data.PS2_XGESTO.trim());
        tpSetVal('#PS2_VIGINI' , data.PS2_VIGINI);
        tpSetVal('#PS2_VIGFIM' , data.PS2_VIGFIM);
        tpSetVal('#PS2_TPCON'  , data.PS2_TPCON );
        tpSetVal('#PS2_CUMULA' , data.PS2_CUMULA);
        tpSetVal('#PS2_DTRENO' , data.PS2_DTRENO);
        tpSetVal('#PS2_DTLREN' , data.PS2_DTLREN);
        tpSetVal('#PS2_DAVIRE' , data.PS2_DAVIRE);
        tpSetVal('#PS2_LIMCAN' , data.PS2_LIMCAN);
        tpSetVal('#PS2_TOLERA' , data.PS2_TOLERA);
        tpSetVal('#PS2_AVPERC' , data.PS2_AVPERC);
        tpSetVal('#PS2_OBSCON' , data.PS2_OBSCON.trim());
        tpSetVal('#PS2_XINFGE' , data.PS2_XINFGE.trim());
        tpSetVal('#PS2_XRETEC' , data.PS2_XRETEC.trim());
        
        scmFichaPrePedido_carregaIncoterms(data.PS2_INCOTE.trim());
        
        if(empty(data.A2_IDIOMA.trim()) || data.A2_IDIOMA.trim() == 'PT_BR'){
            $(tpSelector('#divPS2_INCOTE')).hide()
            $(tpSelector('#divDdlFrete')).show()
        }else{
            $(tpSelector('#divPS2_INCOTE')).show()
            $(tpSelector('#divDdlFrete')).hide()
        }
        
        scmFichaPrePedido_ddlResponsaveis(data.PS2_RESPON.trim())
		
        if(getTetrisParams('UTILIZA_TIPO_SC') == 'S') {
    		if(!empty(data.PS2_XOBS)) {
    		    tpSetVal('txtObsevaçãoTipoSC', data.PS2_XOBS.trim());
    		}
    		
    		setTimeout(function(){
    		    tpSetVal('PS2_IDPSN', data.PS2_IDPSN.trim() + "|" + data.PSN_MSG.trim() + "|" + data.PSN_FORM.trim() + "|" + data.PSN_GRUPO.trim().replaceAll(";", "/"));
    		    
    		  	if(!empty(data.PSN_FORM)) {
    		        tpDisable('PS2_IDPSN');
    		    }
    		}, 200);
		}


    	if(existBlock(typeof scmFichaPrePedidoPE_get)){
    	    scmFichaPrePedidoPE_get(oDados);
    	}
	}
	
	if(scmFichaPrePedido.habilitaGrpAprova == "S"){
        //scmFichaPrePedido_initddlGrpAprov();
        scmFichaPrePedido_ddlGrupoAprovacao()
        setSelect2(tpSelector('#ddlGrupoAprov'),data.PS2_APROV,data.PS2_APROV + " -  " + data.AL_DESC);
	}
}

function scmFichaPrePedido_somaTotais(lEdita) {
    var aData = scmFichaPrePedido.aData;
    var nValorFrete = 0 ;
    var nValorSeguro = 0;
    var nValorDespesa = 0;
    var nValorDesconto = 0;
	var nValorICMS = 0;
    var nValorPIS = 0;
    var nValorCOFINS = 0;					 
    
    for (var i = 0; i < aData.length; i++) {
        nValorFrete     += parseFloat(aData[i].PS2_VLFRET,2); 
        nValorSeguro    += parseFloat(aData[i].PS2_VLSEGU,2); 
        nValorDespesa   += parseFloat(aData[i].PS2_DESPES,2); 
        nValorDesconto  += parseFloat(aData[i].PS2_VLDESC,2); 
		nValorICMS      += parseFloat(aData[i].PS2_VLICMS,2); 
        nValorPIS       += parseFloat(aData[i].PS2_VLPIS,2); 
        nValorCOFINS    += parseFloat(aData[i].PS2_VLCOF,2); 												  
    }
    
    
    if ( aData.length >= 1){
        // nValorFrete     += parseFloat(aData[0].PS2_VLFRET,2); 
        // nValorSeguro    += parseFloat(aData[0].PS2_VLSEGU,2); 
        // nValorDespesa   += parseFloat(aData[0].PS2_DESPES,2); 
    }
    
    if (!lEdita) {
        tpSetVal("#txtValorFrete",formatNumber(nValorFrete,2));
	    tpSetVal("#txtValorSeguro",formatNumber(nValorSeguro,2));
	    tpSetVal("#txtValorDespesa",formatNumber(nValorDespesa,2));
    }
	else {
	    nValorFrete = parseFloat(tpGetVal('#txtValorFrete').valor() || 0,2);
	    nValorSeguro = parseFloat(tpGetVal('#txtValorSeguro').valor() || 0,2);
	    nValorDespesa = parseFloat(tpGetVal('#txtValorDespesa').valor() || 0,2);
    }
	
	var nTotalImpostos = 0;
	var nTotalProdutos = 0;
	var nTotalGeral = 0;
	
    if(!lEdita){
    	for (var i = 0; i < aData.length; i++) {
    	    nTotalProdutos += parseFloat(aData[i].PS2_TOTAL) 
    	    nTotalImpostos += parseFloat(aData[i].PS2_VALIPI) +  parseFloat(aData[i].PS2_ICMST) +  parseFloat(aData[i].PS2_ICMDA)
    	    nTotalGeral += parseFloat(aData[i].PS2_TOTAL) + parseFloat(aData[i].PS2_VALIPI) +  parseFloat(aData[i].PS2_ICMST) +  parseFloat(aData[i].PS2_ICMDA)
    	}
    }
    else{
        nTotalProdutos = parseFloat(tpGetVal('#txtTotalProdutos'));
        for (var i = 0; i < aData.length; i++) {
    	    nTotalImpostos += parseFloat(aData[i].PS2_VALIPI) +  parseFloat(aData[i].PS2_ICMST) +  parseFloat(aData[i].PS2_ICMDA)
    	    nTotalGeral += parseFloat(aData[i].PS2_VALIPI) +  parseFloat(aData[i].PS2_ICMST) +  parseFloat(aData[i].PS2_ICMDA)
    	}
    	nTotalGeral += parseFloat(nTotalProdutos);
    }
	tpSetVal('#txtTotalProdutos', formatNumber(nTotalProdutos,2).valor());
	tpSetVal('#txtTotalImpostos', formatNumber(nTotalImpostos,2).valor());
	tpSetVal('#txtTotalICMS', formatNumber( nValorICMS ,2).valor());
	tpSetVal('#txtTotalPIS', formatNumber( nValorPIS ,2).valor());
	tpSetVal('#txtTotalCOFINS', formatNumber( nValorCOFINS ,2).valor());																 
	tpSetVal('#txtTotalGeral', formatNumber((nTotalGeral+ nValorFrete + nValorSeguro + nValorDespesa) - nValorDesconto ,2).valor());
    tpSetVal('#txtTotalDesconto', formatNumber(nValorDesconto,2).valor());
    $(tpSelector('#txtTotalDesconto')).attr('valor_orig', formatNumber(nValorDesconto,2).valor())
}

/* Desabilitar Todos os Campos da Ficha Pré-Pedido */
function scmFichaPrePedido_disableForm() {

	var aInputs = ["txtNumeroItem", "txtNumPrePedido", "txtEmissao", "ddlCondPag", "txtObsPagto", "ddlFrete", "ddlMoeda","txtValorFrete", "txtValorSeguro", "txtContato", "txtObsPre", 
        "txtNumeroSolicitacao", "ddlSolicitante", "ddlCentroCusto", "ddlComprador", "ddlEntregar", "ddlGrupoProduto", "txtQtde", "txtUnidade", "txtValor", "txtDtEntrega", "txtObs", 
        "hdfCodDestinatario", "hdfUltimaMsg", "hdfNumeroRegistros", "chkAutoScroll", "txtMensagemChat", "chatUpload", "btnFinalizar", "btnSalvar", "PS2_JUSTIF","txtValorDespesa",
        "PS2_IDPSM","PS2_NFNUM","PS2_NFSERI","PS2_NFEMIS","PS2_NFVENC","txtTotalDesconto","btnVldOrc","ddlTipoFollowUp","txtEmail","ddlOP","PS2_MODALI","PS2_DSCCON","PS2_TPCTO","PS2_VIGE",
        "PS2_UNVIGE","PS2_FLGRES","PS2_INDICE","PS2_FLGCAU","PS2_TPCAU","PS2_MINCAU","PS2_OBJCTO","PS2_ALTCLA","PS2_PEDTII", "txtNatureza", "ddlEntObra", "PS2_PIS", "PS2_COFINS", 
        "PS2_CSLL", "PS2_IR", "PS2_INSS", "PS2_ISS", "PS2_ESPECI","PS2_CHVNFE","PS2_UFORIG","PS2_UFDEST","PS2_BSPIS", "PS2_BSCOFI", "PS2_BSCSLL", "PS2_BSIRRF", "PS2_BSINSS", 
        "PS2_BSISS", "PS2_ENVPED", "PS2_COPCOM", "PS2_COPSOL", "PS2_AVISO", "PS2_TPCTE","txMoeda","PS2_XGESTO", "PS2_APRCON", "PS2_VIGINI","PS2_VIGFIM","PS2_TPCON","PS2_CUMULA",
        "PS2_DTRENO","PS2_DTLREN","PS2_DAVIRE","PS2_LIMCAN","PS2_TOLERA","PS2_AVPERC","PS2_OBSCON","PS2_NUMCON","PS2VINC","ddlLocalFaturamento","PS2_RESPON", "PS2_INCOTE", "PS2_APRVCP", 
        "PS2_XINFGE", "PS2_XRETEC"];

	for (var i = 0; i < aInputs.length; i++) {
		$(tpSelector("#" + aInputs[i])).attr('disabled', 'disabled');
	    tpDisable("#" + aInputs[i])
	}

	try {
		$(tpSelector("#ddlFornecedor")).select2('disable');
		$(tpSelector("#txtNatureza")).select2('disable');
        $(tpSelector("#ddlProdutos")).select2('disable');
        $(tpSelector("#PS2_UFORIG")).select2('disable');
        $(tpSelector("#PS2_UFDEST")).select2('disable');
        disableSelect('#ddlGrupoAprov');
        disableSelect('#PS2_ESPECI');
        disableSelect('#PS2_MUNORG');
        disableSelect('#PS2_MUNDST');
        disableSelect('#PS2_TPCTE');
        disableSelect('#txMoeda');
        
	}catch (e) { }
	
	tpDisable("ddlPrioridadeCab")
	tpDisable("PS2_APRCON")
	tpDisable('#btnMaisOrigem');
	$(tpSelector('#divItemPrePedido')).hide();
	//$('#btnSalvar').hide();
	$(tpSelector('#btnFinalizar')).show();
	$(tpSelector('#btnFinalizarAguarde')).hide();
	$(tpSelector('#divPS2_NFANEX')).hide();
	$(tpSelector('#divPS2_ANXXML')).hide();
	$(tpSelector('#btnNovoItem')).hide();
	
	if (existBlock(typeof scmFichaPrePedidoPE_disableForm)) {
        scmFichaPrePedidoPE_disableForm();
    } 
}

function scmFichaPrePedido_limpaCampos() {
    if (existBlock(typeof scmFichaPrePedidoPE_limpaCampos_ini)) {
        scmFichaPrePedidoPE_limpaCampos_ini();
    }else{
    	/* Limpar dados do Tab - Item Pré-Pedido */
    	$(tpSelector('#tituloItemPrePedido')).html('Adicionar Item Pré-Pedido');
    	
        tpSetVal('#PS2_XPLACA', '')
    	//$('#ddlEntregar').val('');
    	setSelect2(tpSelector('#ddlCentroCusto'), '');
    	setSelect2(tpSelector('#PS2_CLVL'), '');
    	tpSetVal('#PS2_CONTA', '', '');
    	
    	setSelect2(tpSelector('#ddlPlanOrc'), '');
    	setSelect2(tpSelector('#ddlContaOrc'), '');
    	
    	//$('#ddlItemConta').val('');
    	//$('#ddlClasseValor').val('');
    	//$('#ddlLinhaNegocio').val('');
    	tpSetVal('#ddlGrupoProduto', '', '');
    	setSelect2(tpSelector('#ddlProdutos'), '', '');
    	$(tpSelector('#txtQtde')).val('');
    	$(tpSelector('#txtUnidade')).val('');
    	//$('#txtDtEntrega').val('');
    	$(tpSelector('#txtValor')).val('');
    	$(tpSelector('#txtValorDesc')).val('');
    	$(tpSelector('#txtValorTotal')).val('');
    	$(tpSelector('#txtIPI')).val('');
    	$(tpSelector('#txtValorIPI')).val('');
    	$(tpSelector('#txtValorICMSST')).val('');
    	$(tpSelector('#txtValorDifal')).val('');
    	$(tpSelector('#txtValorTotalItem')).val('');
    	
    	setSelect(tpSelector('PS2_IDPSN'), '');
        tpSetVal('#txtObsevaçãoTipoSC', '');
        tpSetVal('#PS2_ITEMCT', '', '');
        tpSetVal('#PS2_TIPPLA', scmFichaPrePedido.tipoPlanilha);
        tpSetVal('#ddlLocal', '');
        tpSetVal('#TES', '');
        tpSetVal('#txtBaseICMS', '');
        tpSetVal('#txtICMS', '');
        tpSetVal('#txtValorICMS', '');
        tpSetVal('#txtBasePIS', '');
        tpSetVal('#txtPIS', '');
        tpSetVal('#txtValorPIS', '');
        tpSetVal('#txtBaseCOF', '');
        tpSetVal('#txtCOF', '');
        tpSetVal('#txtValorCOF', '');
    	
    	//$("#ddlClassificacao").val('');
    	//setSelect2('#ddlProjeto', '', '');
    	//setSelect2('#ddlTarefa', '');
    	if(scmFichaPrePedido.habilitaCampoVencimento){
    	    $(tpSelector('#ddlVencimento')).datepicker('update', '');
    	}
    	if(scmFichaPrePedido.habilitaCamposVerba){
    	    $(tpSelector('#ddlVerba')).val('');
    	}
    	$(tpSelector('#txtObs')).val('');
    	$(tpSelector('#txtAnexos')).val('').TPAnexo('');
    
    	setSelect2(tpSelector('#ddlOP'), '');
    	
    	if (existBlock(typeof scmFichaPrePedidoPE_limpaCampos)) {
            scmFichaPrePedidoPE_limpaCampos();
        }
    }    
}

//--------------------------------------------------------------CONDIÇÕES DE FORNECIMENTO-------------------

function scmFichaPrePedido_btnSalvar() {
	/* Salva o Cabeçalho e as Condições do Fornecedor */
	scmFichaPrePedido.gerarPed = 'N'
	scmFichaPrePedido_save('S');
}

/**
 * Chamada para Finalizar Pedido
 * ACAO = 'F'
 */
function scmFichaPrePedido_finalizar() {
    var numPre      = $(tpSelector("#txtNumPrePedido")).val();
    var cPS2_MODALI = tpGetVal('PS2_MODALI');
    scmFichaPrePedido.gerarPed = 'S';
    
    if( scmCore_dataPrimeiroArgumentoMaior( scmFichaPrePedido.defineDtLancamento, moment().format('DD/MM/YYYY') ) ){
        bootbox.alert(`Inclusão bloqueada. Os lançamentos serão liberados a partir do dia ${scmFichaPrePedido.defineDtLancamento}. Qualquer dúvida entre em contato com a Contabilidade.`)
        return;
    }

    

    showLoader();

    $(tpSelector('#btnFinalizar')).hide();
    $(tpSelector('#btnFinalizarAguarde')).show();
 	setTimeout(function() {
	
    	var save = empty(tpGetVal('PS2_IDPSN').split('|')[2]) ? scmFichaPrePedido_save('S') : true;
    	
        if (!save){
    	    $(tpSelector('#btnFinalizarAguarde')).hide();
    	    $(tpSelector('#btnFinalizar')).show();
    	    
    	    hideLoader();
    	    return
    	}
    
    	var valido = scmFichaPrePedido_validar('FP');
    
    	if ( scmFichaPrePedido.habilitaPCO == 'S'){
    	    if(getTetrisParams("SCM_MODIFICA_BUSCA_VERBA","SCM") == 'AK2' && getTetrisParams('SCM_VALIDA_ORCAMENTO') == 'S') {
    	        valido = scmFichaPrePedido_validaOrcamentoPco(numPre);
    	    }else if (getTetrisParams('SCM_VALIDA_ORCAMENTO') == 'S') {
    	        valido = scmFichaPrePedido_validaOrcamento();
    	    }
    	}
        
    	if (valido) {
    	    if(scmFichaPrePedido.FLUXO_PADRAO_GERAPC == 'N'){
                toastr.info('Processo de geração de pedido iniciado')
                TPnavpopClose(true);
    	    }    
    	    scmFichaPrePedido_gerarPed(cPS2_MODALI, numPre);
        }
        else {
            $(tpSelector('#btnFinalizar')).show();
            $(tpSelector('#btnFinalizarAguarde')).hide();
        }

    }, 1500);
}


function scmFichaPrePedido_gerarPed(cPS2_MODALI, cPS2_NUM){
  	var codigoProtheus = usuarioLogado.codigoProtheus()
  	var geraPedido =true;
    var cNovoAprov = "";
    
    if(getTetrisParams('HABILITA_NOVO_PROCESSO_APROVACAO', 'SCM') == "S") {
        cNovoAprov = scmFichaPrePedido_defineGrupoAprovacaoNovoProcesso();
    }
    
    if(getTetrisParams('HABILITA_NOVO_PROCESSO_APROVACAO', 'SCM') != "S" &&  getTetrisParams("DEFINE_REGRA_GRUPO_APROVACAO_PC") =="CC") {
        geraPedido = scmFichaPrePedido_validaRegraDeAprovacaoCc(cPS2_NUM);
    }
    
  	if(geraPedido){
      	tpParam.ClearParam();
    	tpParam.AddParams('ACAO'        ,  'FP');
    	tpParam.AddParams('PS2_NUM'     ,  cPS2_NUM);
    	tpParam.AddParams('CUSER'       ,  codigoProtheus);
    	tpParam.AddParams('PAR_APROV'   ,  getTetrisParams("DEFINE_REGRA_GRUPO_APROVACAO_PC"));
    	tpParam.AddParams('GERASC1'     ,  scmCore.geraSC1);
    	tpParam.AddParams('MSEXSC1'     ,  getTetrisParams('SCM_MSEXECAUTO_MATA110','SCM'));
    	tpParam.AddParams('HABEMISSAO'  ,  getTetrisParams('SCM_ALTERA_DATA_EMISSAO_PRE_PEDIDO','SCM'));
         tpParam.AddParams('CENTRAL'     ,  getTetrisParams('SCM_HABILITA_SC_CENTRALIZADAS','SCM'));
    	tpParam.AddParams('USAPROTHEUS' ,  getTetrisParams('SCM_USA_PROTHEUS','SCM'));
    	tpParam.AddParams('VALMED'      ,  getTetrisParams('SCM_VALIDA_MEDIA','SCM'));
        tpParam.AddParams('MBASE'       ,  getTetrisParams('SCM_VALOR_MEDIA_QUESTIONARIO','SCM'));
    	tpParam.AddParams('ORIGEM_PCO'  ,  getTetrisParams("SCM_MODIFICA_BUSCA_VERBA","SCM"));
    	tpParam.AddParams('GERPCPDR'    ,  scmFichaPrePedido.FLUXO_PADRAO_GERAPC);
    	
        tpParam.AddParams('EMPFIL_ADHOC',  scmFichaPrePedido.EMPFIL_ADHOC);
        
        tpParam.AddParams('NOVAREGRAAPROV'  , getTetrisParams('HABILITA_NOVO_PROCESSO_APROVACAO', 'SCM'));
        
        if(getTetrisParams('HABILITA_NOVO_PROCESSO_APROVACAO', 'SCM') == "S") {
            if(cNovoAprov.aprovacao == "GP") {
                tpParam.AddParams('NOVOGRPAPROV', cNovoAprov.conteudoAprovacao);
            } else {
                tpParam.AddParams('NOVOGRPAPROV', '');
            }
        }
    	
    	tpParam.SendFormPostASync('UPDPS2', (oDados)=>{
            if (oDados.errorcode == '00') {
                var data                = oDados.content.split('|');
                var PS0_NUM             = data[0];
                var CR_USER             = data[1];
                var dest                = data[2];
                var emailsEnvolvidos    = "";
        		emailsEnvolvidos        =  scmFichaPrePedido.habilitaResponsaveis == "S" ? scmFichaPrePedido_emailsEnvolvidos(tpGetVal('#PS2_RESPON')) : "";
        		
        		scmFichaPrePedido_gravaSLA(PS0_NUM);
        		setTimeout(function() {
                    //API SAP4HANA
                    if (scmFichaPrePedido.integraAPISAPS4 == 'S'){
                        scmApiSapS4_integrarPedidoCompra(PS0_NUM, tpGetEmpFil() ,emailsEnvolvidos)
                    } else{
    		            scmEnviaPedidoCompraAutomatico( PS0_NUM, tpGetEmpFil() ,emailsEnvolvidos)
                    }
    			    scmFichaPrePedido_enviarEmailPendenteAprovacao(PS0_NUM, emailsEnvolvidos)
        		}, 2000);
    		    												 
        		if(existBlock(typeof scmFichaPrePedidoPE_scmEnviaPedidoCompraAutomatico)){
                    scmFichaPrePedidoPE_scmEnviaPedidoCompraAutomatico(PS0_NUM, tpGetEmpFil());
            	}
        		
        		if(scmFichaPrePedido.FLUXO_PADRAO_GERAPC == 'S'){
    		    	if ( cPS2_MODALI == 'A' || cPS2_MODALI == 'C') {
        		        toastr.success(`Contrato gerado Nº ${PS0_NUM}`);
            		}else{
            		    toastr.success(`Pedido gerado Nº ${PS0_NUM}`);
        		    }
        		}
                
        		//WEBPOSTO
    			if(getTetrisParams("SCM_HABILITA_API_WEBPOSTO") == 'S'){
    					
    				if(scmFichaPrePedido.parametroIntegracaoWebPosto.INTEGRA_PEDIDO_AO_GERAR == 'S'){
    					scmApiWebPosto_integrarPedidoCompra(PS0_NUM) 
    				}
    			}
    		
        		/*== API SAP B1 ==*/
        	    if (scmFichaPrePedido.integraAPISAP == 'S'){
        	        
        	        if(scmFichaPrePedido.parametroIntegracaoAPISAP.INTEGRA_PEDIDO_AO_GERAR == "S"){
        	            scmApiSap_integrarPedidoCompra(PS0_NUM)
        	        }
        	        
        		    if(existBlock(typeof scmFichaPrePedidoPE_finalizar)){
        		        scmFichaPrePedidoPE_finalizar(PS0_NUM);
        		    }
        		}
        
        		if(existBlock(typeof scmFichaPrePedidoPE_retornoFinalizar)){
                    scmFichaPrePedidoPE_retornoFinalizar(PS0_NUM);
                }
                
                if(scmFichaPrePedido.FLUXO_PADRAO_GERAPC == 'S'){
                    TPnavClose(true);
                    hideLoader();
                }
                else {
                   
                    var cMsg = `
                            <div>
                                ${cPS2_MODALI == 'A' || cPS2_MODALI == 'C' 
                                    ? `<span>Contrato gerado Nº ${PS0_NUM}</span>`
                                    : `<span>Pedido gerado Nº ${PS0_NUM}</span>`
                                }
                            </div>`
                    
                    var dataParams = {
    					destinatarios: usuarioLogado.email(),
    					assunto: `Status Pré-Pedido Nº ${cPS2_NUM}`,
    					conteudo: cMsg,
    					anexos: '',
    					envioUsuario: 'S',
    					callback: '',
    					callbackSuccess: '',
    					callbackError: '',
    				};
                			
                	envMail(dataParams);
                }
       
    			if(scmFichaPrePedido_verificarRegularizar()){
                    scmFichaPrePedido_geraNFAuto(PS0_NUM)
                }
                scmFichaPrePedido_verificarPercContrato(PS0_NUM)
        	}
        	else {
        	    if(scmFichaPrePedido.FLUXO_PADRAO_GERAPC == 'S'){
                    bootbox.alert(oDados.errormsg.replace(/\n/g, '<br>'));
            		$(tpSelector('#btnFinalizarAguarde')).hide();
                    $(tpSelector('#btnFinalizar')).show();
                }else{
                    
                    var cMsg = `
                            <div>
                                <p> Não foi possivel gerar o Pedido</p>
                                <p><b>Critica: </b> ${oDados.errormsg.replace(/\n/g, '<br>')}</p>
                            </div>`
                    
                    var dataParams = {
    					destinatarios: usuarioLogado.email(),
    					assunto: `Status Pré-Pedido Nº ${cPS2_NUM}`,
    					conteudo: cMsg,
    					anexos: '',
    					envioUsuario: 'S',
    					callback: '',
    					callbackSuccess: '',
    					callbackError: '',
    				};
    				
                	envMail(dataParams);
                }
                hideLoader();
        	}
    	});
	
    	if(existBlock(typeof scmFichaPrePedidoPE_gerarPedRetorno)){
            scmFichaPrePedidoPE_gerarPedRetorno(cPS2_NUM);
        }
  	}    
}

function scmFichaPrePedido_emailsEnvolvidos(usEnvolvidos) {
    var emails = ''
    
    if(!empty(usEnvolvidos)) {
        usEnvolvidos.split(";").forEach((usuario, index) => {
            tpParam.ClearParam() 
            tpParam.AddParams('CONSULTA'    , 'SCM142');
            tpParam.AddParams('ZT1_CODIGO'  , usuario );
            
            var oDados = tpParam.SendFormPost('WSGETCONS');
            var data = ajustaraData(oDados)[0];
            
            index == 0 ? emails += data.ZT1_EMAIL :  emails += ';' + data.ZT1_EMAIL;
            
        })
    }else{
        emails = "";
    }
    
    return emails;
}

function scmFichaPrePedido_enviarEmailPendenteAprovacao(CR_NUM, emailsEnvolvidos){
    var aData            = ""
    
    tpParam.ClearParam();
	tpParam.AddParams('CONSULTA'   , 'SCM801');
	tpParam.AddParams('C7_NUM'     , CR_NUM);

     var oDados       = tpParam.SendFormPost('WSGETCONS');
    
    if(oDados.errorcode == '00') {
        aData           = ajustaraData(oDados);
        var data        = aData[0]
        var cAprov      = data.CR_APROV
        var dest        = data.ZT1_EMAIL
        var cAprovador  = data.ZT1_NOME
        
        if(!empty(dest)){
    
            dataParams = {
                destinatarios: dest,
                destinatariosCC: emailsEnvolvidos,
                assunto: "Pedido Pendente de Aprovação",
                conteudo: encodeURI(scmCore_geraHtmlEmail(CR_NUM,cAprovador,"PC"))
            };                            
            envMail(dataParams);
        }    
    }
}																


function scmFichaPrePedido_gravaSLA(numPc) {
    tpParam.ClearParam();
	tpParam.AddParams('CONSULTA'    , 'SCMA56');
	tpParam.AddParams('C7_NUM'      , numPc);

    var oDados = tpParam.SendFormPost('WSGETCONS')
    if (oDados.errorcode == '00'){
        var aData = ajustaraData(oDados)
        
        aData.forEach( function(data){
            if ( !empty(data.C7_ITEMSC)){
                var cStatus = ''
                if( data.PS2_MODALI.trim() == 'A' ||  data.PS2_MODALI.trim() == 'C' ) {
                    cStatus = '010';
                } else {
					cStatus = '007'; 
                }
            
                scmCore_gravaSLA(data.C7_FILIAL, data.C7_NUMSC, data.C7_ITEMSC, cStatus);
            }
        })
    }
}

function scmFichaPrePedido_validaOrcamentoPco(numPre) {
    $('#btnFinalizar').hide();
    
    var lRet      = true;
    var aDataOrca = [];
    
    tpParam.ClearParam(); 
    tpParam.AddParams('CONSULTA', 'SCM633'); 
    tpParam.AddParams('PEDIDO'  , numPre); 
    
    var cDadosVerOrc = '';
    var oDados       = tpParam.SendFormPost('WSGETCONS');
    
    if(oDados.errorcode == '00') {
        var aDataOrc = ajustaraData(oDados);
        
        scmFichaPrePedido.aDataSolOrc = aDataOrc
        aDataOrca = aDataOrc
        
        aDataOrc.forEach( (data, index) => {            
            if(!empty(data.PS2_CODPLA) && !empty(data.PS2_CO)) {
                if(empty(cDadosVerOrc)){
                    cDadosVerOrc = data.PS2_CODPLA.trim()+','+data.PS2_CO.trim()+','+data.PS2_DTENTR+','+data.PS2_TOTAL.trim()+','+(scmFichaPrePedido.validaCCustoPCO ? data.PS2_CC : ' ' )+','+(scmFichaPrePedido.validaFilEntPCO ? data.PS2_FILENT : ' ' )
                }else{
                    cDadosVerOrc += "|"+data.PS2_CODPLA.trim()+','+data.PS2_CO.trim()+','+data.PS2_DTENTR+','+data.PS2_TOTAL.trim()+','+(scmFichaPrePedido.validaCCustoPCO ? data.PS2_CC : ' ' )+','+(scmFichaPrePedido.validaFilEntPCO ? data.PS2_FILENT : ' ' )
                }
            }else {
                
                if(!(empty(data.PS2_CODPLA) && empty(data.PS2_CO))) {
                    cItem = data.PS2_ITEM
                    lRet = false
                }
            }
        })
    }
    
    if(!empty(cDadosVerOrc) && lRet) {
        tpParam.ClearParam();
        tpParam.AddParams('LSTORC', cDadosVerOrc);
        var oDados = tpParam.SendFormPost('VLDORC');
        
        if(oDados.errorcode != '00' && oDados.errormsg != 'nao gerou') {
            
            var cMensagem  = oDados.errormsg.replace('|','')
            var cContent  = oDados.errormsg.replace('|','')
            cContent  = cContent.replaceAll('<b>'  , '')
            cContent  = cContent.replaceAll('</b>' , '')
            
            if (getTetrisParams('HABILITAR_PREFIXO_FUNCAO_TPCS','SCM')){
                cContent  = cContent.replaceAll("\n" , "<br>")
                cMensagem  = cMensagem.replaceAll("\n" , "<br>")
            }
            
            var aContent  = cContent = cContent.split('<br>')  // ['Orçamento: ORCAMENTO 2023 - TESTE', 'Conta: MATERIAL BASICO', 'Tipo Bloqueio: Mensal Compentencia', 'Data Competencia: 31/03/2023', 'Saldo Disp: R$     20.805,00', 'Valor Requerido: R$     21.000,00', '']
            
            scmFichaPrePedido.idCodPla = ""
            scmFichaPrePedido.idCodCon = ""
            
			var texto                   = aContent[0].trim()
			var padrao                  = /\((.*?)\)/ 
			var correspondencia         = texto.match(padrao);
			var correspondenciaContaOrc = aContent[1].trim().match(padrao);

			if (correspondencia.length > 0) {
				scmFichaPrePedido.idCodPla = correspondencia[1];
			}
			
			if (correspondenciaContaOrc.length > 0) {
				scmFichaPrePedido.idCodCon = correspondenciaContaOrc[1];
			}
            
            var vlrRequerido  = aContent[5].substring(19, 40).trim();
            var vlrDisponivel = aContent[4].substring(14, 40).trim();
            
            var nDifereca = (parseFloat(vlrDisponivel.valor()) - parseFloat(vlrRequerido.valor())) * -1
            
            if (!getTetrisParams('HABILITAR_PREFIXO_FUNCAO_TPCS','SCM')){
                nDifereca = formatNumber(nDifereca, 2)  
            }      
            
            
            var existSolic = false;
            
            tpParam.ClearParam();
        	tpParam.AddParams('CONSULTA'    , 'SCM631');
        	tpParam.AddParams('PTS_ID'      , 'ALL');
        	tpParam.AddParams('PTS_STATUS'  , 'P');
        	tpParam.AddParams('PTS_CODPLA'  , 'ALL');
        	tpParam.AddParams('PTS_CO'      , 'ALL');
        	tpParam.AddParams('USUARIO'     , 'ALL');
        	tpParam.AddParams('PTS_ORIGEM'  , "PP-"+numPre);
        	
        	var oDados2 = tpParam.SendFormPost('WSGETCONS');
        	if(oDados2.errorcode == '00') {
        	    var aData = ajustaraData(oDados2)
        	    
        	    if(!empty(aData[0].PTS_ORIGEM)) {
        	        existSolic = true;
        	    }
        	}
            
            var html  = `<div class="row">`
                html += `   <div class="col-md-12" style="margin-bottom:15px">`
                html += `       <div>${cMensagem}</div>`
                html += `   </div>`
                html += `   <div class="col-md-12" style="margin-bottom:15px;display:none" id="divValorSolicitaOrc">`
                html += `       <div class="col-md-4" style="padding-left: 0px;padding-right: 0px;">`
                html += `           <label style="margin-top:5px"><b>Valor a ser solicitado:</b></label>`
                html += `       </div>`
                html += `       <div class="col-md-8" style="padding-left: 0px;padding-right: 0px">`
                html += `           <input id="valorSolicitaOrc" required class="form-control VALOR2" value="${nDifereca}"></input>`
                html += `       </div>`
                html += `   </div>`
                html += `   <div class="col-md-12" style="margin-bottom:15px">`
                html += `       <textarea id="obsSolicitaOrc" required class="form-control" placeholder="Observação" style="display:none"></textarea>`
                html += `   </div>`
                
                if(existSolic) {
                    html += `   <div id="txtAviso" class="col-md-12 text-center" style="margin-bottom: 10px">`
                    html += `       <h4 id="btnVoltaSolicOrc" class=""><b>Aguradando liberação...</b></h4>`
                    html += `   </div>`
                    html += `   <div id="divBotoes" class="col-md-4 col-lg-offset-4">`
                    html += `       <a id="btnVoltaSolicOrc" class="btn btn-default col-md-12 pull-right" onclick="scmFichaPrePedido_cancelaAjusteOrcamento()">&nbsp;Voltar</a>`
                    html += `   </div>`
                }else{
                    html += `   <div id="divBotoes" class="col-md-6">`
                    html += `       <a id="btnVoltaSolicOrc" class="btn btn-default col-md-9 pull-right" onclick="scmFichaPrePedido_cancelaAjusteOrcamento()">&nbsp;Voltar</a>`
                    html += `   </div>`
                    html += `   <div id="divBotoes" class="col-md-6">`
                    html += `       <a id="btnSolicOrc" class="btn btn-primary col-md-9 pull-left"  onclick="scmFichaPrePedido_solicitarAjusteOrcamento()">&nbsp;Solicitar Orçamento</a>`
                    html += `       <a id="btnFinalSolic" class="btn btn-success col-md-9 pull-left" style="display:none" onclick="scmFichaPrePedido_confirmarSolicitacaoAjusteOrcamento()">&nbsp;Confirmar Solicitação</a>`
                    html += `   </div>`
                }
                
                html += `</div>`
            
            lRet = false;
            
            $(tpSelector('#btnFinalizar')).show();
            $(tpSelector('#btnFinalizarAguarde')).hide();
            TPnavpop(html, '', '35%');

        }
    }else if (!lRet){
        hideLoader()
        bootbox.alert("Inconsistência no preenchimento dos dados do Item: " + cItem)
    }
    
    return lRet;

}

function scmFichaPrePedido_cancelaAjusteOrcamento() {
    tpNavpopClose(true);
    $(tpSelector('#btnFinalizar')).show();
    $(tpSelector('#btnFinalizarAguarde')).hide();
}

function scmFichaPrePedido_solicitarAjusteOrcamento() {
    $(tpSelector('#btnSolicOrc')).hide(20);
    $(tpSelector('#btnFinalSolic')).show(100);
    $(tpSelector('#divValorSolicitaOrc')).show(100);
    $(tpSelector('#obsSolicitaOrc')).show(100);
}

function scmFichaPrePedido_confirmarSolicitacaoAjusteOrcamento() {
    if(!empty(tpGetVal('#obsSolicitaOrc'))) {
        var aData = scmFichaPrePedido.aDataSolOrc;
        var cIndex;
        
        aData.forEach((data, index) =>{
            if(data.PS2_CODPLA.trim() == scmFichaPrePedido.idCodPla.trim() && data.PS2_CO.trim() == scmFichaPrePedido.idCodCon.trim()) {
                cIndex = index;
            }
        })
        
        tpParam.ClearParam();
        tpParam.AddParams('CONSULTA'    , 'SCM423'); 
        tpParam.AddParams('AK1_CODIGO'  , aData[cIndex].PS2_CODPLA.trim());
        tpParam.AddParams('AK1_XTIPO'   , 'ALL');
        tpParam.AddParams('AK1_FILENT'  , 'ALL');
        tpParam.AddParams('AK1_FASE'    , 'ALL');
        tpParam.AddParams('CAMPOSPE'    , 'IN:');
        tpParam.AddParams('GROUPPE'     , 'IN:');
        
        var oDados = tpParam.SendFormPost('WSGETCONS');
        
        if(oDados.errorcode == '00') {
            var data = ajustaraData(oDados)
        }
        
        var codigoAprovadores = data[0].AK1_APROVA.trim();
        var codigoUsuario     = usuarioLogado.codigoUsuario();
        var dataAtual         = hoje();
        var valSolicitado     = tpGetVal('#valorSolicitaOrc').valor();
        
        tpParam.ClearParam();
        tpParam.AddParams('ACAO'        , "I");
        tpParam.AddParams('ALIAS'       , 'PTS');
        tpParam.AddParams('INDICE'      , '1');
        tpParam.AddParams('PTS_ID'      , "TGFUN=U_TPNEXTID('PTS','PTS_ID')");
        tpParam.AddParams('PTS_CODPLA'  , aData[cIndex].PS2_CODPLA.trim());
        tpParam.AddParams('PTS_CO'      , aData[cIndex].PS2_CO.trim());
        tpParam.AddParams('PTS_DTCOMP'  , aData[cIndex].PS2_DTENTR.trim());
        tpParam.AddParams('PTS_CODSOL'  , codigoUsuario);
        tpParam.AddParams('PTS_DTSOLI'  , dataAtual);
        tpParam.AddParams('PTS_OPERAC'  , 'A');
        tpParam.AddParams('PTS_VALOR'   , valSolicitado);
        tpParam.AddParams('PTS_OBS'     , tpGetVal('#obsSolicitaOrc'));
        tpParam.AddParams('PTS_STATUS'  , 'P');
        tpParam.AddParams('PTS_APROVA'  , codigoAprovadores);
        tpParam.AddParams('PTS_ORIGEM'  , 'PP-'+aData[cIndex].PS2_NUM);
        
        tpParam.SendFormPostASync('TABGENER', 'scmMapaCotacaoV2Utils_confirmarSolicitacaoAjusteOrcamentoCallback(oDados)')
    }else{
        $(tpSelector('#obsSolicitaOrc')).css( `border` , `1.5px solid #f03038`);
        toastr.warning('Preencha a Observação');
        setTimeout(function() {
            $(tpSelector('#obsSolicitaOrc')).css( `border` , `1px solid #e5e5e5`);
        }, 3000);
        return false;
    }
    
}

function scmFichaPrePedido_confirmarSolicitacaoAjusteOrcamentoCallback(oDados) {
    if(oDados.errorcode == '00') {
        toastr.success('Solicitação de Ajuste Orçamentário realizada!');
        tpNavpopClose(true);
        $(tpSelector('#btnFinalizar')).show();
        $(tpSelector('#btnFinalizarAguarde')).hide();
    }
}

function scmFichaPrePedido_salvaProdPTC(numPre){
    
    if (empty($(tpSelector('#ddlFornecedor')).select2('data'))){
        PS2_FORNEC = ''
        PS2_LOJA = ''
    }else{
        var ddlFornecedor   =   $(tpSelector('#ddlFornecedor')).select2('data');;
    	var PS2_FORNEC      =   ddlFornecedor.id.split('/')[0];			    /* PS2_FORNEC */
    	var PS2_LOJA        =   ddlFornecedor.id.split('/')[1];
    }
    
    tpParam.ClearParam(); 
    tpParam.AddParams('ACAO'        , 'U'); 
    tpParam.AddParams('PS2_NUM'     ,  numPre)
    tpParam.AddParams('PS2_FORNEC'  ,  PS2_FORNEC)
    tpParam.AddParams('PS2_LOJA'    ,  PS2_LOJA)
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
	
    var oDados = tpParam.SendFormPost('UPDPTC');
    
    if(oDados.errorcode == '00'){
        return true;
        
	 
    }else if(oDados.errorcode == '10' || oDados.errorcode == '09' || oDados.errorcode == '08'){
        let Prods = oDados.errormsg.split('|');
        let cHtml = '<ul>'
        
        Prods.forEach(dados => {
            if(!empty(dados)){
                cHtml += `<li> ${dados} </li>`
            }
        })
        
        cHtml += '</ul>'
        
        toastr.warning(`
                    <b> Os produtos abaixo não foram vinculados a um código de referência do fornecedor. </b> 
                    <br>
                    ${cHtml}
                    <b> O código de referência ja está vinculado a outro produto. </b>
        `);
        
        // Se gerar pedido retorna false e não continua o save, se for só salvar continua o save e cadastra o restante dos dados do pré pedido
        if (scmFichaPrePedido.gerarPed == "S") {
            return false;
        } else {
            return true;
        }
        
    }
    
    else{
        toastr.warning('<span>Falha na criação de vínculo:</span> <br/> ' + oDados.errormsg , 'Produto X Fornecedor')
        return true;
    }
}


function scmFichaPrePedido_posicionaDadosProduto(produto) {
    if(empty(produto)){
        $(tpSelector('#txtUnidade')).attr('disabled', false);
    }
    else{
        if(getTetrisParams("SCM_PERMISSAO_PARA_ALTERAR_UNIDADE_DE_MEDIDA") == "S"){
            $(tpSelector('#txtUnidade')).attr('disabled', false);
        }
        else{
            $(tpSelector('#txtUnidade')).attr('disabled', true);
        }
    }

	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM037');
	tpParam.AddParams('B1_COD', produto);
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

	var oDados = tpParam.SendFormPost('WSGETCONS');

	if (oDados.errorcode == '00') {
		var aData = ajustaraData(oDados);
		var data = aData[0];

		tpSetVal('#ddlGrupoProduto', data.B1_GRUPO, data.B1_GRUPO.trim() + ' - ' + data.BM_DESC);

		$(tpSelector('#txtUnidade')).val(data.B1_UM);
		if(scmFichaPrePedido.habilitaCampoLocal == 'S') {
            tpSetVal('ddlLocal',data.B1_LOCPAD,data.B1_LOCPAD + ' - '+ data.NNR_DESCRI);
        }
		$(tpSelector('#txtUnidade')).attr('tpcallback', "$(tpSelector('#txtUnidade')).val('" + data.B1_UM + "');");
		tpSetVal('#PS2_CONTA'   , data.B1_CONTA, data.B1_CONTA.trim() + ' - ' + data.CT1_DESC01);
		
		if(getTetrisParams("SCM_GATILHA_ITEM_CONTABIL") == "S"){
            tpSetVal('#PS2_ITEMCT', data.B1_ITEMCC, data.B1_ITEMCC.trim() +" - "+data.CTD_DESC01 );
        }

		
		if ( getTetrisParams("HABILITA_TABELA_PRECO_PRE_PEDIDO","SCM") == "S"){
		    
		    tpParam.ClearParam();
	        tpParam.AddParams('CONSULTA', 'SCM249');
		    tpParam.AddParams('AIA_CODFOR', $(tpSelector('#ddlFornecedor')).val().split('/')[0]);
	        tpParam.AddParams('AIA_LOJFOR', $(tpSelector('#ddlFornecedor')).val().split('/')[1]);
	        tpParam.AddParams('AIB_CODPRO', produto);
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
	        
	        var oDados = tpParam.SendFormPost('WSGETCONS');

	        if (oDados.errorcode == '00') {
	        	var aData = ajustaraData(oDados);
		        var data = aData[0];
	        
	            $(tpSelector("#txtValor")).val(formatNumber(data.PRECO,2))
	        }
		}
		
		if ( getTetrisParams('SCM_HABILITA_PESQUISA_PRODUTO_X_FORNECEDOR','SCM') == 'S' ) {
           
            tpParam.ClearParam();
            tpParam.AddParams('CONSULTA', 'SCM279');
            tpParam.AddParams('A5_PRODUTO', produto);
            tpParam.AddParams('A5_FORNECE', $(tpSelector('#ddlFornecedor')).val().split('/')[0]);
            tpParam.AddParams('A5_LOJA'   , $(tpSelector('#ddlFornecedor')).val().split('/')[1]);
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
            
            var oDados = tpParam.SendFormPost('WSGETCONS');
            
            if (oDados.errorcode == '00') {
            	var aData = ajustaraData(oDados);
            	var data = aData[0];
            
            	$(tpSelector("#txtValor")).val(data.A5_PRECO01);
            	
            }
            
        }
	}
}

function scmFichaPrePedido_calcularValorTotal() {
    
    if (existBlock(typeof scmFichaPrePedidoPE_calcularValorTotal)) {
        scmFichaPrePedidoPE_calcularValorTotal();
    }else{
        var txtQtde	=        (tpGetVal('#txtQtde') || '0').valor();
    	var txtValor =       (tpGetVal('#txtValor') || '0').valor();
    	var txtValorICMSST = (tpGetVal('#txtValorICMSST') || '0').valor();
    	var txtValorDifal =  (tpGetVal('#txtValorDifal') || '0').valor();
    	var txtIPI =  (tpGetVal('#txtIPI') || '0').valor();
    	var txtValorIPI =    (tpGetVal('#txtValorIPI') || '0').valor();
    	var txtValorDesc = (tpGetVal('#txtValorDesc') || '0').valor();
    	var txtValorTotal = parseFloat(txtQtde) * parseFloat(txtValor) ;
    	var valTotal = (txtValorTotal + parseFloat(txtValorICMSST) + parseFloat(txtValorDifal) + parseFloat(txtValorIPI)) - parseFloat(txtValorDesc);
    	
    	tpSetVal('#txtValorTotalItem',formatNumber(valTotal,2).valor());
    	tpSetVal('#txtValorTotal',formatNumber(txtValorTotal,2).valor());
    }
}

function scmFichaPrePedido_calcularValorTotalIPI() {
    var txtIPI =  parseFloat( (tpGetVal('#txtIPI') || '0').valor() );
	var txtQtde	=        (tpGetVal('#txtQtde') || '0').valor();
	var txtValor =       (tpGetVal('#txtValor') || '0').valor();
	var txtValorTotal = parseFloat(txtQtde) * parseFloat(txtValor);
	
	var valTotalIPI = txtValorTotal * txtIPI /100;
	
	tpSetVal('#txtValorIPI',formatNumber(valTotalIPI,2).valor());
	scmFichaPrePedido_calcularValorTotal();
}

function scmFichaPrePedido_calcularValorTotalICMS() {
    var valICMS =  parseFloat( (tpGetVal('#txtICMS') || '0').valor() );
	var valBaseICMS = parseFloat( (tpGetVal('#txtBaseICMS') || '0').valor() );
	
	var valTotalICMS = valBaseICMS * valICMS /100;
	
	tpSetVal('#txtValorICMS',formatNumber(valTotalICMS,2).valor());
	//scmFichaPrePedido_calcularValorTotal();
}

function scmFichaPrePedido_calcularValorTotalPIS() {
    var valPIS =  parseFloat( (tpGetVal('#txtPIS') || '0').valor() );
	var valBasePIS = parseFloat( (tpGetVal('#txtBasePIS') || '0').valor() );
	
	var valTotalPIS = valBasePIS * valPIS /100;
	
	tpSetVal('#txtValorPIS',formatNumber(valTotalPIS,2).valor());
	//scmFichaPrePedido_calcularValorTotal();
}

function scmFichaPrePedido_calcularValorTotalCOF() {
    var valCOF =  parseFloat( (tpGetVal('#txtCOF') || '0').valor() );
	var valBaseCOF = parseFloat( (tpGetVal('#txtBaseCOF') || '0').valor() );
	
	var valTotalCOF = valBaseCOF * valCOF /100;
	
	tpSetVal('#txtValorCOF',formatNumber(valTotalCOF,2).valor());
	//scmFichaPrePedido_calcularValorTotal();
}
function scmFichaPrePedido_calcularValor() {

	var valor = 0;

	var txtQtde = $(tpSelector('#txtQtde')).val();
	var txtValorTotal = $(tpSelector('#txtValorTotal')).val();

	try {

		txtQtde = strIsVoid(txtQtde) ? "0" : toSendNumber(txtQtde);
		txtValorTotal = strIsVoid(txtValorTotal) ? "0" : toSendNumber(txtValorTotal);

		var qtde = parseFloat(txtQtde);
		var valorTotal = parseFloat(txtValorTotal);

		valor = parseFloat(valorTotal / qtde);
	}
	catch (e) { }

	var cValor = formatNumber(valor, 6);

	$(tpSelector('#txtValor')).val(cValor);
}

function scmFichaPrePedido_editarItemPrePedido(){
    scmFichaPrePedido_animateOpenDivItemPrePedido();
	
	$(tpSelector('#btnNovoItem')).hide();
	$(tpSelector('#btnAdicionarItem')).hide();
	$(tpSelector('#btnsEdicao')).show();
}

function scmFichaPrePedido_cancelarInclusaoItem(){
    scmFichaPrePedido_animateCloseDivItemPrePedido();
	
	$(tpSelector('#btnNovoItem')).show();
	$(tpSelector('#btnAdicionarItem')).hide();
	$(tpSelector('#btnsEdicao')).hide();
	
	scmFichaPrePedido_limpaCampos();
	
}

function scmFichaPrePedido_incluirNovoItem(){
    if(scmFichaPrePedido.habilitaRegraTipoSC == 'S') {
        scmFichaPrePedido.ACAO = "A";
        
        if(!empty(tpGetVal('PS2_IDPSN').split('|')[2])) {
            var formulario = tpGetVal('PS2_IDPSN').split('|')[2].trim();
            
            $(tpSelector('#btnNovoItem')).hide();
            
            if($('#divItemFormDinamico').css('display') == 'none') {
                scmFichaPrePedido_exibirFormularioNaDiv(formulario, 'I');
            }else{
                scmFichaPrePedido_limparFormulario();
                $(tpSelector('#divBtnIncluir')).hide();
                $(tpSelector('#divBtnAlterar')).show();
            }
            
            scmFichaPrePedido_animateCloseDivItemForm();
        } else{
            scmFichaPrePedido_animateOpenDivItemPrePedido();
        	scmFichaPrePedido_limpaCampos();
        	
        	if(getTetrisParams("SCM_OCULTA_IMPOSTOS_FICHA_PREPEDIDO_ITEM") == 'S'){
                $(tpSelector('#txtIPI')).parent().parent().hide();
                $(tpSelector('#txtValorIPI')).parent().parent().hide();
                $(tpSelector('#txtValorICMSST')).parent().parent().hide();
                $(tpSelector('#txtValorDifal')).parent().parent().hide();
                $(tpSelector('#txtBaseICMS')).parent().parent().hide();
                $(tpSelector('#txtICMS')).parent().parent().hide();
                $(tpSelector('#txtValorICMS')).parent().parent().hide();
                $(tpSelector('#txtBasePIS')).parent().parent().hide();
                $(tpSelector('#txtPIS')).parent().parent().hide();
                $(tpSelector('#txtValorPIS')).parent().parent().hide();
                $(tpSelector('#txtBaseCOF')).parent().parent().hide();
                $(tpSelector('#txtCOF')).parent().parent().hide();
                $(tpSelector('#txtValorCOF')).parent().parent().hide();
            }
            
            if(getTetrisParams("SCM_HABILITA_TES_FICHA_PREPEDIDO") == 'S'){
                $(tpSelector('#divTES')).attr('hidden', false);
            }
            
        	$(tpSelector('#tituloItemPrePedido')).html('Novo Item Pré-Pedido');
        	$(tpSelector("#txtNumeroItem")).val('');
        	$(tpSelector("#PS2_ITEM")).val('');
        	
	
            if(getTetrisParams('FIXA_LOCAL_DE_ENTREGA') == 'S') {
                tpSetVal('ddlEntregar', getCookie('EmpFil').substr(2))
                $(tpSelector('#ddlEntregar')).attr('disabled', true);
            } else {
                $(tpSelector('#ddlEntregar')).val('');
            }
            
 
            $(tpSelector('#txtDtEntrega')).val(moment().format('DD/MM/YYYY'));
            $(tpSelector('#txtQtde')).attr('disabled',false);
        	$(tpSelector('#btnNovoItem')).hide();
        	$(tpSelector('#btnAdicionarItem')).show();
        	$(tpSelector('#btnsEdicao')).hide();
    	}
	}else{
        scmFichaPrePedido_animateOpenDivItemPrePedido();
    	scmFichaPrePedido_limpaCampos();
    	
    	if(getTetrisParams("SCM_OCULTA_IMPOSTOS_FICHA_PREPEDIDO_ITEM") == 'S'){
            $(tpSelector('#txtIPI')).parent().parent().hide();
            $(tpSelector('#txtValorIPI')).parent().parent().hide();
            $(tpSelector('#txtValorICMSST')).parent().parent().hide();
            $(tpSelector('#txtValorDifal')).parent().parent().hide();
            $(tpSelector('#txtBaseICMS')).parent().parent().hide();
            $(tpSelector('#txtICMS')).parent().parent().hide();
            $(tpSelector('#txtValorICMS')).parent().parent().hide();
            $(tpSelector('#txtBasePIS')).parent().parent().hide();
            $(tpSelector('#txtPIS')).parent().parent().hide();
            $(tpSelector('#txtValorPIS')).parent().parent().hide();
            $(tpSelector('#txtBaseCOF')).parent().parent().hide();
            $(tpSelector('#txtCOF')).parent().parent().hide();
            $(tpSelector('#txtValorCOF')).parent().parent().hide();
        }
        
        if(getTetrisParams("SCM_HABILITA_TES_FICHA_PREPEDIDO") == 'S'){
            $(tpSelector('#divTES')).attr('hidden', false);
        }
        
    	$(tpSelector('#tituloItemPrePedido')).html('Novo Item Pré-Pedido');
    	$(tpSelector("#txtNumeroItem")).val('');
    	$(tpSelector("#PS2_ITEM")).val('');
    	
        
        if(getTetrisParams('FIXA_LOCAL_DE_ENTREGA') == 'S') {
            tpSetVal('ddlEntregar', getCookie('EmpFil').substr(2))
            $(tpSelector('#ddlEntregar')).attr('disabled', true);
        } else {
            $(tpSelector('#ddlEntregar')).val('');
        }
        
    	
        $(tpSelector('#txtDtEntrega')).val(moment().format('DD/MM/YYYY'));
        $(tpSelector('#txtQtde')).attr('disabled',false);
    	$(tpSelector('#btnNovoItem')).hide();
    	$(tpSelector('#btnAdicionarItem')).show();
    	$(tpSelector('#btnsEdicao')).hide();
	}
	
	if(existBlock(typeof scmFichaPrePedidoPE_incluirNovoItem)){
        scmFichaPrePedidoPE_incluirNovoItem();
    }
 
}
function scmFichaPrePedido_cancelarEdicaoItem(){
    if(existBlock(typeof scmFichaPrePedidoPE_cancelarEdicaoItem)){
        scmFichaPrePedidoPE_cancelarEdicaoItem();
    }else{
        
        if (tpGetVal("#txtTipoPedido") != 2){
            var comprador = scmBuscaComprador(usuarioLogado.codigoUsuario());
            
            if(comprador.Y1_XEDQUPP == 'S'){
                $(tpSelector('[id^=txtQuant_]')).attr('disabled', false);
            }
        
            $(tpSelector('[id^=txtPreco_]')).attr('disabled', false);
            
            $(tpSelector('#btnNovoItem')).show();
        	$(tpSelector('#btnAdicionarItem')).hide();
        	$(tpSelector('#btnsEdicao')).hide();
        	
        	scmFichaPrePedido_limpaCampos();
        }
    
        scmFichaPrePedido_animateCloseDivItemPrePedido();
    }
   
}

function scmFichaPrePedido_finalizarEdicaoItem(){
    var saveOk = scmFichaPrePedido_save('A');
    var txtNumPrePedido = tpGetVal('#txtNumPrePedido')
    
    if(saveOk){
        scmFichaPrePedido.idUltimoItemAlterado = `idlinkProd_${tpConvert.encodeObj(tpGetVal("#txtNumPrePedido") + tpGetVal("#txtNumeroItem"))}`
        
        scmFichaPrePedido_animateCloseDivItemPrePedido();
    	
    	if (tpGetVal("#txtTipoPedido") != 2){
        	$(tpSelector('#btnNovoItem')).show();
        	$(tpSelector('#btnAdicionarItem')).hide();
        	$(tpSelector('#btnsEdicao')).hide();
        	
        	scmFichaPrePedido_limpaCampos();
        	setTimeout(() => {
        	    scmFichaPrePedido_atualizaTotal()
        	}, 1000)
    	}
    	
    	scmFichaPrePedido_itens_createGrid(txtNumPrePedido)
    }
}

function scmFichaPrePedido_animateOpenDivItemPrePedido(){
    if($(tpSelector('#divItemPrePedido')).css('display') == 'none'){
        $(tpSelector('#divItemPrePedido')).animate({
		    display: "block",
            height: "toggle"
		}, 500);
    		
    	setTimeout(() => {
            document.getElementById("divItemPrePedido").scrollIntoView({ behavior: "auto", block: "center" });
        }, 600)	
    }
}

function scmFichaPrePedido_animateCloseDivItemPrePedido(){
    if($(tpSelector('#divItemPrePedido')).css('display') == 'block'){
        $(tpSelector('#divItemPrePedido')).animate({
    		    display: "none",
                height: "toggle"
    		}, 500);
    }
}

function scmFichaPrePedido_renderStatusPrePedido(PS2_STATUS = null){
    switch(PS2_STATUS){
        case '001':
            return $(tpSelector('#statusPrePedido')).html('<span class="label label-warning col-xs-12">Pendente</status>');
        case '002':
            return $(tpSelector('#statusPrePedido')).html('<span class="label label-success col-xs-12">Pedido Gerado</status>');
        default: 
            return $(tpSelector('#statusPrePedido')).html('<span class="label label-default col-xs-12">Em Confecção</status>');
    }
}

function scmFichaPrePedido_erroWebservice(oDados){
    bootbox.alert({title: 'Erro WebService', message: oDados.errormsg.replace(/\n/g, '\\n')});
}

function scmFichaPrePedido_callbackdllComprador() {
    $(tpSelector('#ddlComprador')).attr('tpcallback', "$(tpSelector('#ddlComprador')).val('" + usuarioLogado.codigoUsuario() + "');");
}

function scmFichaPrePedido_ddlProdutosChange() {
    var cB1_COD = tpGetVal('#ddlProdutos');
    
	tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM037')
    tpParam.AddParams('B1_COD', cB1_COD)
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

    if(getTetrisParams("HABILITA_CONTROLE_CA_SC_E_PD") == "S"){
        aParams[0].Conteudo = 'SCM500';
    }

    tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_ddlProdutosChangeCallback(data)');
}

function scmFichaPrePedido_ddlProdutosChangeCallback(oDados) {
    var data = ajustaraData(oDados);
    tpSetVal('#PS2_CONTA', data[0].B1_CONTA, data[0].B1_CONTA.trim() + ' - ' + data[0].CT1_DESC01 );
    
    if(scmFichaPrePedido.habilitaDescricaoSubst == "S"){
        $(tpSelector('#ddlSubDesc')).val(data[0].B1_DESC.trim());
    }
    
    if(getTetrisParams("HABILITA_CONTROLE_CA_SC_E_PD") == "S"){
        scmFichaPrePedido_carregaCA(oDados)
    }
}

function scmFichaPrePedido_carregaCA(oDados){
    let aData       = ajustaraData(oDados);
    let cCA         = '';
    let arrayCa     = [];
    let qtdDias     = getTetrisParams("DEFINE_QTDDIAS_VENC_CA");
    
    aData.forEach((data, index) =>{
        let TN3_DTVENC  = parseInt(data.TN3_DTVENC)
        let DTVENCATUAL = parseInt(moment().add(qtdDias, 'days').format('YYYYMMDD'));
        
        if(!empty(data.TN3_NUMCAP) && (TN3_DTVENC > DTVENCATUAL)){
            arrayCa.push(data.TN3_NUMCAP.trim());
        }
    })
    
    if(!empty(arrayCa)){
        
        arrayCa.forEach((TN3_NUMCAP, index) => {
            if(index == 0){
                cCA += `CA: ${TN3_NUMCAP}` 
            }
            else{
                cCA += ` / ${TN3_NUMCAP}`
            }
        })
    }
    
    tpSetVal('#txtObs',cCA);
}

function scmFichaPrePedido_initDdlPlanOrc() {
    if(existBlock(typeof scmFichaPrePedidoPE_initDdlPlanOrc)){
        scmFichaPrePedidoPE_initDdlPlanOrc();
    } else {

        if( getTetrisParams("SCM_MODIFICA_BUSCA_VERBA") == 'AK2' ){
        
            $(tpSelector("#ddlPlanOrc")).select2({
                minimumInputLength: 1,
                dropdownAutoWidth: true,
                escapeMarkup: function (m) { return m; },
                query: function (query) {
                    $(tpSelector('#ddlPlanOrc')).select2('val', '');
                    tpParam.ClearParam();
                    tpParam.AddParams('CONSULTA', 'SCM963'); // Ou consulta SCM350
                    tpParam.AddParams('PESQUISA', '%' + query.term + '%');
                    tpParam.AddParams('PAGINA', '1');
                    tpParam.AddParams('TAMPAG', '20');
                    tpParam.AddParams('HEADER', 'N');
    				tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
        
                    var ddlValue = 's.AK1_CODIGO';
                    var ddlText = 's.AK1_CODIGO + " - " + s.AK1_DESCRI';
                    var nomeFuncao = tpGetNomeFuncaoWSGETCONS();
        
                    $.ajax({
                        url: tpGetResourceUrl('WSGETCONS'),
                        dataType: "text",
                        async: true,
                        data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
                        success: function (ajaxData) {
                            data = GetContentJson(ajaxData);
                            var ddlData = { results: [] }, i, j, s;
                            if (data.errorcode == '00') {
                                var aData = ajustaraData(data, true)
                                if (aData.length > 0) {
                                    $(aData).each(function (index, s) {
                                        ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
                                    })
                                }
                                else
                                {
                                        //ddlData.results.push({ id: '', text: query.term });
                                }
                                query.callback(ddlData);
                            }
                            else {
                                console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
                                scmFichaDetalheSC_erroWebservice(data);
                            }
                        },
                        error: function (err) {					  
                            console.log('Nao conformidade solicitacao ajax');								   
                        }
                    });											 
                }
            }).on("select2-selecting",function(e){
                //scmFichaDetalheSC_posicionaDadosProduto(e.val);
                setSelect2(tpSelector('#ddlContaOrc'), '');
            });													  
                
        }else{
        
            $(tpSelector("#ddlPlanOrc")).select2({
                minimumInputLength: 1,
                dropdownAutoWidth: true,
                escapeMarkup: function (m) { return m; },
                query: function (query) {
                    $(tpSelector('#ddlPlanOrc')).select2('val', '');
                    tpParam.ClearParam();
                    tpParam.AddParams('CONSULTA', 'SCM234');
                    tpParam.AddParams('PESQUISA', '%' + query.term + '%');
                    tpParam.AddParams('PAGINA', '1');
                    tpParam.AddParams('TAMPAG', '20');
                    tpParam.AddParams('HEADER', 'N');
    				tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
        
                    var ddlValue = 's.AK1_CODIGO';
                    var ddlText = 's.AK1_CODIGO + " - " + s.AK1_DESCRI';
                    var nomeFuncao = tpGetNomeFuncaoWSGETCONS();
        
                    $.ajax({
                        url: tpGetResourceUrl('WSGETCONS'),
                        dataType: "text",
                        async: true,
                        data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
                        success: function (ajaxData) {
                            data = GetContentJson(ajaxData);
                            var ddlData = { results: [] }, i, j, s;
                            if (data.errorcode == '00') {
                                var aData = ajustaraData(data, true)
                                if (aData.length > 0) {
                                    $(aData).each(function (index, s) {
                                        ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
                                    })
                                }
                                else
                                {
                                        //ddlData.results.push({ id: '', text: query.term });
                                }
                                query.callback(ddlData);
                            }
                            else {
                                console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
                                scmFichaDetalheSC_erroWebservice(data);
                            }
                        },
                        error: function (err) {
                            console.log('Nao conformidade solicitacao ajax');							   
                        }
                    });												 
                }
            }).on("select2-selecting",function(e){
                //scmFichaDetalheSC_posicionaDadosProduto(e.val);
                setSelect2(tpSelector('#ddlContaOrc'), '');
            });
        }
    }
}

function scmFichaPrePedido_initDdlContaOrc() {
	if ( existBlock(typeof scmFichaPrePedidoPE_initDdlContaOrc)){
        scmFichaPrePedidoPE_initDdlContaOrc();
    }else{
		$(tpSelector("#ddlContaOrc")).select2({
			minimumInputLength: 1,
			dropdownAutoWidth: true,
			escapeMarkup: function (m) { return m; },
			query: function (query) {
				$(tpSelector('#ddlContaOrc')).select2('val', '');
				
				tpParam.ClearParam();
				
				if( getTetrisParams("SCM_MODIFICA_BUSCA_VERBA") == 'AK2' ){
				    var cCC = scmFichaPrePedido.habilitaFiltroCOCC == "S" ? tpGetVal('ddlCentroCusto')  : 'ALL';
				    var cLE = scmFichaPrePedido.habilitaFiltroCOLE == "S" ? tpGetVal('ddlEntregar')     : 'ALL';
				    
					tpParam.AddParams('CONSULTA'    , 'SCM135');
					tpParam.AddParams('PESQUISA'    , '%' + query.term + '%');  
					tpParam.AddParams('ORCAMENTO'   , tpGetVal('ddlPlanOrc'));
					tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
                    tpParam.AddParams('CENTRO'      , cCC);
                    tpParam.AddParams('LOCAL_ENT'   , cLE);
                    
					var ddlValue   = 's.AK2_CO';
					var ddlText    = "s.AK2_CO + ' - ' + s.AK5_DESCRI";
					var nomeFuncao = tpGetNomeFuncaoWSGETCONS();
					
				} else {
					tpParam.AddParams('CONSULTA', 'SCM235');
					tpParam.AddParams('PESQUISA', '%' + query.term + '%');
					tpParam.AddParams('CODPLA', $(tpSelector('#ddlPlanOrc')).val() );
					tpParam.AddParams('PAGINA', '1');
					tpParam.AddParams('TAMPAG', '20');
					tpParam.AddParams('HEADER', 'N');
					tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
		
					var ddlValue = 's.AK3_CO';
					var ddlText = 's.AK3_CO + " - " + s.AK3_DESCRI';
					var nomeFuncao = tpGetNomeFuncaoWSGETCONS();
				}

				$.ajax({
					url: tpGetResourceUrl('WSGETCONS'),
					dataType: "text",
					async: true,
					data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
					success: function (ajaxData) {
						data = GetContentJson(ajaxData);
						var ddlData = { results: [] }, i, j, s;
						if (data.errorcode == '00') {
							var aData = ajustaraData(data, true)
							if (aData.length > 0) {
								$(aData).each(function (index, s) {
									ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
								})
							}else{
								//ddlData.results.push({ id: '', text: query.term });
							}
							
							query.callback(ddlData);
						}else {
							console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
							scmFichaDetalheSC_erroWebservice(data);
						}
					},
					error: function (err) {
						console.log('Nao conformidade solicitacao ajax');
					}
				});
			}
		})
    }
}

function scmFichaPrePedido_buscaVerba(codOrcamento, contaOrcamentaria) {

    Metronic.startPageLoading();
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'    , 'SCM435');
    tpParam.AddParams('ORCAMENTO'  , codOrcamento);
    tpParam.AddParams('CONTA'       , contaOrcamentaria);
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var oDados = tpParam.SendFormPost('WSGETCONS')
    let data = ajustaraData(oDados)
    
    let totalComprometido   = parseFloat(data[0].QTDSC7) + parseFloat(data[0].QTDPS2)
    let totalDisponivel     = parseFloat(data[0].TOTAL)  - totalComprometido
    
    return Number(totalDisponivel)
}

function scmFichaPrePedido_consultaListaVerbas(){
    
    Metronic.startPageLoading();
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'        , 'SCM381');
    tpParam.AddParams('NUMPREPEDIDO'    , tpGetVal('txtNumPrePedido'));
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var oDados = tpParam.SendFormPost('WSGETCONS')
    let data = ajustaraData(oDados)
    
    return data
}

function scmFichaPrePedido_buscaOrcamentos(){
    TPnav('scmListaControleOrcamentario.html #conteudo', `scmListaControleOrcamentario_init('PP', '${tpGetVal('ddlPlanOrc')}', '')` , '90%');
}

function scmFichaPrePedido_verificarOrcamento(codOrcamento, valorTotal, contaOrcamentaria){
    
    //Quando codOrcamento é undefined significa que a função foi chamada pelo botão "Verificar orçamento"
    if( codOrcamento == undefined && getTetrisParams('SCM_VALIDA_ORCAMENTO') == 'N'){
        
        var listaVerbas = scmFichaPrePedido_consultaListaVerbas()
        
        hideLoader();
        TPnav('scmListaControleOrcamentario.html #conteudo', `scmListaControleOrcamentario_init("VO", '${tpGetVal('ddlPlanOrc')}', '${tpConvert.encodeObj(listaVerbas)}')` , '90%');
        
    } else{
		
        //Verifica se o orçamento mencionado no pré-pedido possui verba suficiente
		if( !empty(codOrcamento) ) {    
		    var verbaDisponivel = scmFichaPrePedido_buscaVerba(codOrcamento, contaOrcamentaria)
    		var total           = parseFloat(valorTotal)
    		
    		showLoader();
			
            if( verbaDisponivel < total ){
				
                //Não possui verba suficiente para incluir o item 
                hideLoader();
                TPnav('scmListaControleOrcamentario.html #conteudo', `scmListaControleOrcamentario_init("PP", '${tpGetVal('ddlPlanOrc')}')` , '90%');
                bootbox.alert('Verba insuficiente!');
                
            } else {
                ///Possui verba o suficiente para incluir o item
                
                var prepedido = $(tpSelector("#txtNumPrePedido")).val();
                var solicitante = $(tpSelector('#ddlSolicitante')).text();
                
                valido = true // scmFichaPrePedido_save('S');
                
                if (valido){
                    
                    verbaDisponivel = verbaDisponivel - total
                    toastr.success('Verba disponível: R$ ' + formatNumber(verbaDisponivel, 2));
                    
                    scmFichaPrePedido_save('I');
                } else {
                    hideLoader();
                }
            }
            
        } else {
            
            //Este bloco é executado para o fluxo normal do pré-pedido, quando não há um orçamento vinculado
            var prepedido   = $(tpSelector("#txtNumPrePedido")).val();
            var solicitante = $(tpSelector('#ddlSolicitante')).text();
            valido = scmFichaPrePedido_save('S');
            
            if (valido){
				
                if( getTetrisParams("SCM_MODIFICA_BUSCA_VERBA") != 'AK2' ){
				 
                    bootbox.dialog({ size: 'large', message: '<div id="modalOrcamento"></div>', });

                    $(tpSelector('.modal-dialog')).css('width', '95%');    
                    
                    if(getTetrisParams("SCM_CONTROLE_ORCAMENTARIO_CONTA_SUPERIOR") == "S"){
                        // TPnavclick('scmResumoContaSuperior.html #conteudo', '#modalOrcamento', 'scmResumoContaSuperior_preencheDados(\'' + prepedido + '\', \'' + solicitante + '\', \'RD\');');
                        TPnavpop('scmResumoContaSuperior.html', 'scmResumoContaSuperior_preencheDados(\'' + prepedido + '\', \'' + solicitante + '\', \'RD\')', '80%',);
                    }else{
                        TPnavpop('scmValidaOrcamentoPco.html', 'scmValidaOrcamentoPco_preencheDados(\'' + prepedido + '\', \'' + solicitante + '\', \'RD\')', '80%',);
                    }                 
                }
                    
            } else {
                hideLoader();
            }
        }        
    }
}

function scmFichaPrePedido_validaOrcamento(){
    var lRet = true
    var cItem = ''
    
    tpParam.ClearParam(); 
    tpParam.AddParams('CONSULTA', 'SCM633'); 
    tpParam.AddParams('PEDIDO'  , tpGetVal("#txtNumPrePedido")); 
    
    var oDados = tpParam.SendFormPost('WSGETCONS');
    if(oDados.errorcode == '00') {
        var aDataOrc = ajustaraData(oDados);
        
        aDataOrc.forEach( (data, index) => {            
            if ( empty(data.PS2_CODPLA) || empty(data.PS2_CO) ){
                cItem = data.PS2_ITEM
                lRet = false
            }
        })
    }
    
    if (lRet){
        tpParam.ClearParam();
    	tpParam.AddParams('PS2_NUM'     , tpGetVal("#txtNumPrePedido") );
    	tpParam.AddParams('PS2_TIPO'    , getTetrisParams('PCO_CONSIDERA_PERIODO','SCM') );
    	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    	
    	if(getTetrisParams("SCM_CONTROLE_ORCAMENTARIO_CONTA_SUPERIOR") == "S"){
    	    tpParam.AddParams('AGLUTINA', 'S' );
    	    var oDados = tpParam.SendFormPost('VLDCNTSU')
    	} else {
    	    var oDados = tpParam.SendFormPost('VALIDORC')
    	}
    
    	if (oDados.errorcode == '00') {
    	    return true
    	} else{
            bootbox.alert(oDados.errormsg);
            return false
    	}
    }else{
        bootbox.alert("Inconsistência no preenchimento dos dados do Item: " + cItem)
    }
} 
    
function scmFichaPrePedido_posicionaDadosFornecedor(TAB) {

	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM241');
	tpParam.AddParams('A2_COD', $(tpSelector('#ddlFornecedor')).val().split('/')[0]);
	tpParam.AddParams('A2_LOJA', $(tpSelector('#ddlFornecedor')).val().split('/')[1]);
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

	var oDados = tpParam.SendFormPost('WSGETCONS');

	if (oDados.errorcode == '00') {
		var aData = ajustaraData(oDados);
		var data = aData[0];

        // Verificando se o fornecedor selecionado é cadastrado ou generico
        if(data.TABVIGEN.length > 0 && scmFichaPrePedido.habilitaContatoFornecedor == "S") {
            tpParam.ClearParam();
            tpParam.AddParams('CONSULTA',   'SCM332');
            tpParam.AddParams('CAMPOS',     'U5_CONTAT,U5_CODCONT');
            tpParam.AddParams('A2_COD',     $(tpSelector('#ddlFornecedor')).val().split('/')[0]);
            tpParam.AddParams('A2_LOJA',    $(tpSelector('#ddlFornecedor')).val().split('/')[1]);
         
            var paramConsultaContatos = tpCloneArray(aParams);
            var optionSelectContatos = {queryID: 'SCM332', evalValue:'data.U5_CODCONT', evalText:"data.U5_CODCONT + ' - ' + data.U5_CONTAT", multiple: false, aQueryParams: paramConsultaContatos } ;
            gv$.form.bindSelect2('#ddlContato', optionSelectContatos);
            
            $('#ddlContato').parent().show();
            $('#divBtnMaisContato').show();
            $('#txtContato').parent().hide();
            $("#txtContato").val("");
        } else {
            $('#txtContato').parent().show();
            $("#txtContato").val("");
            $('#ddlContato').parent().hide();
            $("#ddlContato").empty();
            $('#divBtnMaisContato').hide();
        }
        
		tpSetVal('#txtNatureza', data.A2_NATUREZ.trim(), data.A2_NATUREZ.trim() + ' - ' + data.ED_DESCRIC)
		tpSetVal(tpSelector('#txtContato'),data.A2_CONTATO.trim())
		tpSetVal(tpSelector('#txtEmail'),data.A2_EMAIL.trim())
		
		if ( getTetrisParams("HABILITA_TABELA_PRECO_PRE_PEDIDO","SCM") == "S"  && TAB == 'S' ){
		    
		    if ( data.TABVIGEN.trim() == 'S'){
		    
    		    bootbox.confirm("Deseja atualizar valor unitário dos itens mediante tabela de preço?<p></p>", function (result) {
                    if (result) {
                        if ( !empty($(tpSelector("#txtNumPrePedido")).val()) ){
                            
                            showLoader();
                            
                            var Desconto = $(tpSelector("#txtTotalDesconto")).val();
                            tpParam.ClearParam();
                            tpParam.AddParams('ACAO'      , 'TAB');
                            tpParam.AddParams('PS2_NUM'   , $(tpSelector("#txtNumPrePedido")).val());
                            tpParam.AddParams('PS2_FORNEC', $(tpSelector('#ddlFornecedor')).val().split('/')[0]);
	                        tpParam.AddParams('PS2_LOJA'  , $(tpSelector('#ddlFornecedor')).val().split('/')[1]);
	                        tpParam.AddParams('TOTALDESC' , Desconto);
							tpParam.AddParams('USAPROTHEUS',  getTetrisParams('SCM_USA_PROTHEUS','SCM'));
							tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
                            
                            var lOk = tpParam.SendFormPostASync('UPDPS2', 'scmFichaPrePedido_posicionaDadosFornecedorCallback(data)');
                        } else{
                            bootbox.alert('Não existe item para alterar.Pré-Pedido não gerado.');   
                        }
                    }
                });
		    } else {
		        //bootbox.alert('Não existe tabela vigente para este fornecedor.');       
		    }
		}
	}
}

function scmFichaPrePedido_posicionaDadosFornecedorCallback(oDados){
    
    if (oDados.errorcode == "00"){
        hideLoader();
        scmFichaPrePedido_cancelarEdicaoItem();
		scmFichaPrePedido_itens_createGrid($(tpSelector("#txtNumPrePedido")).val());                
		bootbox.alert(oDados.errormsg);        
    } else {
        hideLoader();
        bootbox.alert(oDados.errormsg);        
    }
}

// Função para editar contato que chama uma função da scmFichaContato
function scmFichaPrePedido_editContat(){
    var codigoContato   = tpGetVal("#ddlContato");
    var cNomeContato    = tpGetVal("#ddlContato",'text');
    var cFornec         = tpGetVal('#ddlFornecedor').split('/')[0].toString();
    var cLoja           = tpGetVal('#ddlFornecedor').split('/')[1].toString();
    
    scmFichaContato.ACAO = 'A';
    scmFichaContato.callback = `scmFichaPrePedido_atualizarContatos('${cFornec}', '${cLoja}', '${codigoContato}')`;
    
    if (!empty(codigoContato)) {
        if (isMobile()){
            TPnav('scmFichaContato.html #conteudo',  `scmFichaContato_editContato('${codigoContato}', '${cFornec}', '${cLoja}')`, '80%', cNomeContato, '');
        } else {
            TPnavpop('scmFichaContato.html #conteudo',  `scmFichaContato_editContato('${codigoContato}', '${cFornec}', '${cLoja}')`, '80%', null, cNomeContato, '');
        }
    } else{
        bootbox.alert('Por Favor, escolha um Contato');
    }
}

function scmFichaPrePedido_atualizarContatos(codigo, loja, contato) {
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA',   'SCM332');
    tpParam.AddParams('CAMPOS',     'U5_CONTAT,U5_CODCONT');
    tpParam.AddParams('A2_COD',     codigo);
    tpParam.AddParams('A2_LOJA',    loja);
    
    var paramConsultaContatos = tpCloneArray(aParams);
    var optionSelectContatos = {queryID: 'SCM332', evalValue:'data.U5_CODCONT', evalText:"data.U5_CODCONT + ' - ' + data.U5_CONTAT", multiple: false, aQueryParams: paramConsultaContatos, selectedValue: contato} ;
    gv$.form.bindSelect2('#ddlContato', optionSelectContatos);
    
}

// Função para adicionar contato que chama uma função da scmFichaContato
function scmFichaPrePedido_novoContato(){
    if (empty(tpUtil.getVal(tpSelector('#ddlFornecedor')).split('/')[0] )){
        bootbox.alert("Informe um fornecedor.")        
        
        return
    } else {
        var codigoContato   = tpGetVal("#ddlContato");
        var cFornec         = tpGetVal('#ddlFornecedor').split('/')[0].toString();
        var cLoja           = tpGetVal('#ddlFornecedor').split('/')[1].toString();
        
        scmFichaContato.callback = `scmFichaPrePedido_atualizarContatos('${cFornec}', '${cLoja}', '${codigoContato}')`;
        TPnavpop('scmFichaContato.html #conteudo', `scmFichaContato_init('${cFornec}','${cLoja}')`, '80%', null, 'Novo Contato','');
    }
}

function scmFichaPrePedido_listaAdiantamento() {
    if(!empty($(tpSelector("#txtNumPrePedido")).val())){
    	var codpre = $(tpSelector("#txtNumPrePedido")).val();
    	
    	tpParam.ClearParam();
    	tpParam.AddParams('CONSULTA'  , 'SCM242');
    	tpParam.AddParams('PSK_NUM'   , codpre);
    	tpParam.AddParams('PSK_SEQUEN', 'ALL');
    	tpParam.AddParams('PSK_PEDIDO', 'ALL');
		tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    	var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_listaAdiantamentoCreateGridCallback(data)');
    }
}


function scmFichaPrePedido_listaAdiantamentoCreateGridCallback(oDados) {

    if (oDados.errorcode == "00") {
        	    
    	JSTPGrid.BindJDatatable('scmFichaPrePedidoAdiantamento', oDados, 'scmFichaPrePedido_listaAdiantamento_colunas()', 'scmFichaPrePedido_listaAdiantamento_getOTableTools()', false, false, false, false);
    	ajustarColunas('scmFichaPrePedidoAdiantamento', ['10','15%', '15%','10%','10%','40%','30%','10%','10%','10%']);
        		
    }

}

function scmFichaPrePedido_listaAdiantamento_getOTableTools() {
	return {
		"sRowSelect": "single",
		"aButtons": []
	}
}

function scmFichaPrePedido_listaAdiantamento_colunas() {
	
	var colunas = [];
	
	colunas = [
        { "title": "Sequência"    , "data": "PSK_SEQUEN" , "tipoDado": "C", "sClass": "text-center", "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        { "title": "Data Inclusão", "data": "PSK_DATINC" , "tipoDado": "D", "sClass": "text-center", "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        //{ "title": "Pré-Pedido"   , "data": "PSK_DTPREV" , "tipoDado": "D", "sClass": "text-center", "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        { "title": "Data Prevista", "data": "PSK_DTPREV" , "tipoDado": "D", "sClass": "text-center", "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        { "title": "Adiant."      , "data": "PSK_ADIANT" , "tipoDado": "C", "sClass": "text-center", "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        { "title": "Pedido"       , "data": "PSK_PEDIDO" , "tipoDado": "C", "sClass": "text-center", "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        { "title": "Observação"   , "data": "PSK_OBS"    , "tipoDado": "C", "sClass": "text-left", "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        { "title": "Status"       , "data": "PIF_STATUS" , "tipoDado": "C", "sClass": "text-left"  , "render": function (data, type, full, meta) { return scmFichaPrePedido_formatarStatus(data, type, full, meta); } },
        { "title": "Valor"        , "data": "PSK_VALOR"  , "tipoDado": "N", "sClass": "text-right" , "render": function (data, type, full, meta) { return Formatar(data, type, full, meta); } },
        { "title": ""             , "data": "PSK_NUM"    , "tipoDado": "C", "sClass": "text-center", "render": function (data, type, full, meta) { return scmFichaPrePedido_btnAlterarAdiantamento(data, type, full, meta); } },
        { "title": ""             , "data": "PSK_NUM"    , "tipoDado": "C", "sClass": "text-center", "render": function (data, type, full, meta) { return scmFichaPrePedido_btnExcluirAdiantamento(data, type, full, meta); } },
        { "title": ""             , "data": "PSK_PEDIDO" , "tipoDado": "C", "sClass": "text-center", "render": function (data, type, full, meta) { return scmFichaPrePedido_btnSolicitaAprovacao(data, type, full, meta); } }
    ];
    
    return colunas
}

function scmFichaPrePedido_btnAlterarAdiantamento(data, type, full, meta) {

	var fnc = `scmFichaPrePedido_alterarAdiantamento('${full.PSK_NUM}' ,' ${full.PSK_SEQUEN}',' ${'PP'} ' )`;
	var coluna = ''

	if ( empty(full.PSK_ADIANT) ) {
    	coluna += '<a title="Editar Adiantamento" onclick="' + fnc + '" >';
    	coluna += '   <i class="' + GetIcone('UPDATE') + '"></i>';
    	coluna += '</a>';
	} else {
	    coluna = '<span></span>'
	}

	return coluna;
}

function scmFichaPrePedido_addAdiantamento(){
    
    var codpre = $(tpSelector("#txtNumPrePedido")).val();
    
    if (empty(codpre)){
        toastr.warning('Pré pedido não gerado.');
        return
    }else{
        TPnavpop('scmFichaAdiantamento.html #conteudo', `scmFichaAdiantamento_init('${codpre}', '${'I'}','${'PP'}')`, '45%');
    }

}

function scmFichaPrePedido_alterarAdiantamento(cnum,csequen){
    
    var recarrega = 'PP'
    
    TPnavpop('scmFichaAdiantamento.html #conteudo', 'scmFichaAdiantamento_get("'+cnum+'","'+csequen.trim()+'","'+ recarrega + '")', '45%');
 
    
}

function scmFichaPrePedido_btnExcluirAdiantamento(data, type, full, meta){

    var fnc = `scmFichaAdiantamento_excluirAdiantamento('${full.PSK_NUM}' ,' ${full.PSK_SEQUEN}',' ${'PP'} ')`;
	var coluna = ''

	if ( empty(full.PSK_ADIANT) ) {
    	coluna += '<a title="Excluir Adiantamento" onclick="' + fnc + '" >';
    	coluna += '   <i class="fa fa-trash-o larger-xs"></i>';
    	coluna += '</a>';
    } else {
        coluna = '<span></span>'
    }

	return coluna;    
    
}

function scmFichaPrePedido_btnSolicitaAprovacao(data, type, full, meta){

    var coluna = ""
    var grupo  = getTetrisParams('GRUPO_APROV_ADIANT_PEDIDO','SCM');
    var fnc    = ""
    var recarrega = 'PP'
    
    if ( empty(full.PSK_ADIANT) ){
        //fnc    = "scmListaAdiantamento_solicitarAprovacao('" + full.PSK_NUM  + "','" + full.PSK_SEQUEN +  "','" + grupo + "','" + full.PSK_PEDIDO + "','" + recarrega +"');";    
        //coluna =  '<a onclick="' + fnc + '" ><i title="Solicitar Aprovação" class="fa fa-paper-plane col-xs-12"></i> </a>';
        coluna = '<span></span>'
    } else {
        fnc = "scmListaAdiantamento_verListaAprovadores('" + full.PSK_ADIANT + "');";
        coluna = '<a onclick="' + fnc + '" ><i title="Lista de Aprovadores" class="fa fa-bars"></i> </a>';
    }
    
    return coluna
}

function scmFichaPrePedido_formatarStatus(data, type, full, meta){
     if (data == "0") {
            return "<span class='label label-default col-xs-12 default1'>Em Confecção</span>";
        }
        else if (data == "1") {
            return "<span class='label label-warning col-xs-12 warning1'>Pendente Análise</span>";
        }
        else if (data == "2") {
            return "<span class='label label-info col-xs-12' info1>Pendente Aprovação</span>";
        }
        else if (data == "3") {
            return "<span class='label label-primary col-xs-12 primary1'>Aprovado</span>";
        }
        else if (data == "4") {
            return "<span class='label label-success col-xs-12 success1'>Pago</span>";
        }
        else if (data == "5") {
            return "<span class='label label-danger col-xs-12 danger1'>Rejeitado</span>";
        }
        else {
            return "<span class='label label-default col-xs-12 default1'>Solicitar Aprov.</span>";
        }        
}



/**
 * Função para a inicialização do campo dinamico Centro de Custo
 * @param {string} solicitanteCC String com os centros de custo configurados para que o solicitante tenha acesso.
 */
 
function scmFichaPrePedido_onchangePIS(elemento) {
    if(parseFloat(tpGetVal(elemento.id)) < 0){
        bootbox.alert('Valor informado é invalido.'); 
        tpSetVal(elemento.id,formatNumber(0,2));
    }else{
        scmFichaPrePedido_atualizaTotal();
    }
}


function scmFichaPrePedido_atualizaTotal() {
 
    var i = 0;
    var nTotalItens = 0;
    var nTotalParcela = 0;
    
    if(tpGetVal('#txtTotalGeral') == ''){
        nTotalItens = 0;
    }
    else{
        nTotalItens = parseFloat(tpGetVal('#txtTotalGeral'))
    }
    
       // calcula o total dos impostos
    
    var nC7_PIS = parseFloat(empty(tpGetVal('#PS2_PIS')) ? 0 : tpGetVal('#PS2_PIS'));
    var nC7_COFINS = parseFloat(empty(tpGetVal('#PS2_COFINS')) ? 0 : tpGetVal('#PS2_COFINS'));
    var nC7_CSLL = parseFloat(empty(tpGetVal('#PS2_CSLL')) ? 0 : tpGetVal('#PS2_CSLL'));
    var C7_IR =  parseFloat(empty(tpGetVal('#PS2_IR')) ? 0 : tpGetVal('#PS2_IR'));
    var nC7_INSS = parseFloat(empty(tpGetVal('#PS2_INSS')) ? 0 : tpGetVal('#PS2_INSS'));
    var nC7_ISS = parseFloat(empty(tpGetVal('#PS2_ISS')) ? 0 : tpGetVal('#PS2_ISS'));

    var nTotalImpostos = (nC7_PIS + nC7_COFINS + nC7_CSLL + C7_IR + nC7_INSS +  nC7_ISS);
    
    // CALCULA O VALOR LIQUIDO 
    var nTotalLiquido = nTotalItens - nTotalImpostos;
    
    // atualizando o valor 
    scmFichaPrePedido.totalLiquido = nTotalLiquido;
    
    // IMPRIME NA TELA OS CAMPOS DO VALORES TOTAIS 
    $(tpSelector('#totMerc')).html(formatNumber(nTotalItens,2));
    $(tpSelector('#idTotalImpostos')).html(formatNumber(nTotalImpostos,2));
    $(tpSelector('#idTotalGeral')).html(formatNumber(nTotalLiquido, 2));
    
    // DISTRIBUI O VALOR LIQUIDO PARA AS PARCELAS
    
    var nQtdParcelas = $(tpSelector('.valorCondPag')).length;
    var nTotalParcelas = 0;
    
    for (var i = 0; i < nQtdParcelas; i++) {
     
        var nValorParcela = nTotalLiquido / nQtdParcelas;
        nValorParcela = parseFloat(nValorParcela.toFixed(2));
        
        nTotalParcelas =  nTotalParcelas + nValorParcela;
        
        var idInputDinamico = $(tpSelector('.valorCondPag'))[i].id;  
        tpSetVal(idInputDinamico, nValorParcela);
        
    }
    
    var nDiferenca =  nTotalLiquido - nTotalParcelas;
        
    if (nDiferenca !== 0) {
        if(nQtdParcelas == 0){
            
        }
        else{
            var nValorPrimeiaParcela = parseFloat( tpGetVal($(tpSelector('.valorCondPag'))[0].id) );
            tpSetVal( $(tpSelector('.valorCondPag'))[0].id, nValorPrimeiaParcela + nDiferenca );
        }
       
    }
    
}

function scmFichaPrePedido_atualizaTotalViaGet() {
 
    var i = 0;
    var nTotalItens = 0;
    var nTotalParcela = 0;

    if(tpGetVal('#txtTotalGeral') == ''){
        nTotalItens = 0;
    }
    else{
        nTotalItens = parseFloat(tpGetVal('#txtTotalGeral'))
    }
    
       // calcula o total dos impostos
    var nC7_PIS = parseFloat(empty(tpGetVal('#PS2_PIS')) ? 0 : tpGetVal('#PS2_PIS'));
    var nC7_COFINS = parseFloat(empty(tpGetVal('#PS2_COFINS')) ? 0 : tpGetVal('#PS2_COFINS'));
    var nC7_CSLL = parseFloat(empty(tpGetVal('#PS2_CSLL')) ? 0 : tpGetVal('#PS2_CSLL'));
    var C7_IR =  parseFloat(empty(tpGetVal('#PS2_IR')) ? 0 : tpGetVal('#PS2_IR'));
    var nC7_INSS = parseFloat(empty(tpGetVal('#PS2_INSS')) ? 0 : tpGetVal('#PS2_INSS'));
    var nC7_ISS = parseFloat(empty(tpGetVal('#PS2_ISS')) ? 0 : tpGetVal('#PS2_ISS'));

    var nTotalImpostos = (nC7_PIS + nC7_COFINS + nC7_CSLL + C7_IR + nC7_INSS +  nC7_ISS);
    
    // CALCULA O VALOR LIQUIDO 
    var nTotalLiquido = nTotalItens - nTotalImpostos;
    
    // atualizando o valor 
    scmFichaPrePedido.totalLiquido = nTotalLiquido;
    
    // IMPRIME NA TELA OS CAMPOS DO VALORES TOTAIS 
    $(tpSelector('#totMerc')).html(formatNumber(nTotalItens,2));
    $(tpSelector('#idTotalImpostos')).html(formatNumber(nTotalImpostos,2));
    $(tpSelector('#idTotalGeral')).html(formatNumber(nTotalLiquido, 2));
    
}


function scmFichaPrePedido_ddlGrupoAprovacao() {

    var codUserComp = usuarioLogado.codigoUsuario();
	$(tpSelector("#ddlGrupoAprov")).select2({
        placeholder: " ",
        allowClear: true,
        minimumInputLength: 0,
		dropdownAutoWidth: true,
		escapeMarkup: function (m) { return m; },
		query: function (query) {

            tpParam.ClearParam();
            
            tpParam.AddParams('CONSULTA', 'SCM193');
            tpParam.AddParams('CODUSERCOMP', codUserComp);		    
			tpParam.AddParams('PESQUISA', '%' + query.term + '%');
			tpParam.AddParams('PAGINA', '1');
			tpParam.AddParams('TAMPAG', '20');
            tpParam.AddParams('HEADER', 'N');
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
            
            if(existBlock(typeof scmFichaPrePedidoPE_ddlGrupoAprovacao)){
                scmFichaPrePedidoPE_ddlGrupoAprovacao(true);
            } else {
                tpParam.AddParams('PERFIL', 'ALL');
            }

			var ddlValue = 's.AL_COD';
			var ddlText = 's.AL_COD + " - " + s.AL_DESC';
			var nomeFuncao = tpGetNomeFuncaoWSGETCONS();

			$.ajax({
				url: tpGetResourceUrl('WSGETCONS'),
				dataType: "text",
				async: true,
				data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
				success: function (ajaxData) {

					oDados = GetContentJson(ajaxData);

					if (oDados.errorcode == '00') {
						var ddlData = { results: [] }, i, j, s;
						var aData = ajustaraData(oDados);
						if (parseInt(oDados.totalreg) > 0) {
							$(aData).each(function (index, s) {
								ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
							});
						}
						else {
							ddlData.results.push({ id: '', text: query.term });
						}
						query.callback(ddlData);
					}
					else {
						console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
					}
				},
				error: function (err) {
					console.log('Nao conformidade solicitacao ajax');
				}
			});
		}
    });
}


function scmFichaPrePedido_recalculaDesconto(){

    var Desconto = tpGetVal("#txtTotalDesconto");
	
	if(+$(tpSelector('#txtTotalDesconto')).attr('valor_orig') == +Desconto) {
		return
	}

	$(tpSelector('#txtTotalDesconto')).attr('valor_orig', Desconto)
    
    tpParam.ClearParam();
	tpParam.AddParams('ACAO', 'D');
	tpParam.AddParams('PS2_NUM', $(tpSelector("#txtNumPrePedido")).val());
	tpParam.AddParams('TOTALDESC', Desconto);
	tpParam.AddParams('USAPROTHEUS',  getTetrisParams('SCM_USA_PROTHEUS','SCM'));
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
	
	var oDados = tpParam.SendFormPost('UPDPS2');

	if (oDados.errorcode == '00') {

		scmFichaPrePedido_cancelarEdicaoItem();
		
		scmFichaPrePedido_itens_createGrid($(tpSelector("#txtNumPrePedido")).val());
	}
	else {
		bootbox.alert(oDados.errormsg.replace(/\n/g, '\\n'));
	}
}

function scmFichaPrePedido_desabilitaCamposListagemItens(){
    $(tpSelector('.inputsListaPrePedido')).attr('disabled', true);
}

function scmFichaPrePedido_ddlOP() {

    
	$(tpSelector("#ddlOP")).select2({
		minimumInputLength: 2,
		dropdownAutoWidth: true,
		escapeMarkup: function (m) { return m; },
		query: function (query) {

	        tpParam.ClearParam();
	        tpParam.AddParams('CONSULTA', 'SCM285');
			tpParam.AddParams('PESQUISA', '%' + query.term + '%');
			tpParam.AddParams('PAGINA', '1');
			tpParam.AddParams('TAMPAG', '20');
			tpParam.AddParams('HEADER', 'N');
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

			var ddlValue = 's.OP ';
			var ddlText = 's.OP + " - " + s.C2_PRODUTO.trim() + " - " + s.B1_DESC.trim()';
			var nomeFuncao = tpGetNomeFuncaoWSGETCONS();

			$.ajax({
				url: tpGetResourceUrl('WSGETCONS'),
				dataType: "text",
				async: true,
				data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
				success: function (ajaxData) {

					oDados = GetContentJson(ajaxData);

					if (oDados.errorcode == '00') {
						var ddlData = { results: [] }, i, j, s;
						var aData = ajustaraData(oDados);
						if (parseInt(oDados.totalreg) > 0) {
							$(aData).each(function (index, s) {
								ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
							});
						}
						else {
							ddlData.results.push({ id: '', text: query.term });
						}
						query.callback(ddlData);
					}
					else {
						console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
					}
				},
				error: function (err) {
					console.log('Nao conformidade solicitacao ajax');
				}
			});
		}
	}).on('change', function (e) {
	
	}).on('select', function (e) {
	
	})
}


// function scmFichaPrePedido_initddlGrpAprov(){
    
//     $(tpSelector('#ddlGrupoAprov')).select2({
//       placeholder: " ",
//       allowClear: true
//     });
//     //Transforma os dados de centros de custo do solicitante em uma string com separação por virgula sem espaços
//     tpParam.ClearParam()
//     tpParam.AddParams('CONSULTA', 'SCM193');
    
//     var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_initddlGrpAprovCallback(data)');
    
// }

// /**
//  * Função de callback para a renderização das opções no campo dinamico de centro de custo
//  * @param {object} oDados objeto de retorno da consulta
//  */
// function scmFichaPrePedido_initddlGrpAprovCallback(oDados){
    
//     if(oDados.errorcode == '00'){
//         var aData = ajustaraData(oDados);
        
//         $(tpSelector('#ddlGrupoAprov')).html('');
        
//         $(tpSelector('#ddlGrupoAprov')).append($('<option>', {
//                 text: '',
//                 value: ''
//             }));
        
//         $(aData).each(function(index, s){
//             $(tpSelector('#ddlGrupoAprov')).append($('<option>', {
//                 text: `${s.AL_COD} - ${s.AL_DESC}`,
//                 value: s.AL_COD
//             }));
        
//         });
//       setSelect2('#ddlGrupoAprov',scmFichaPrePedido.grupoAprov);  
//     } else {
//         bootbox.alert({title: 'Critica', message: oDados.errormsg.replace(/\n/g, '<br>')});
//     }
// }

// function scmFichaPrePedido_recalculaotais(cChave){
//     scmFichaPrePedido_atualizaItem(cChave)
// }
function scmFichaPrePedido_desformatarNumero(num) {
    if(isNaN(parseFloat(num.valor()))){
        var valor = 0
    }else {
        var valor = parseFloat(num)
    }
      
    return valor;
}

function scmFichaPrePedido_atualizaItem(cChave){

    if(existBlock(typeof scmFichaPrePedidoPE_atualizaItem)){
	    scmFichaPrePedidoPE_atualizaItem(cChave);
	}else{
    	if(!parseFloat(tpGetVal('#txtQuant_'+cChave).valor())) tpSetVal('#txtQuant_'+cChave, '1');
        if(!parseFloat(tpGetVal('#txtPreco_'+cChave).valor())) tpSetVal('#txtPreco'+cChave, '1');
        if(!parseFloat(tpGetVal('#txtTotal_'+cChave).valor())) tpSetVal('#txtTotal'+cChave, '1');
        
        var prePedido = scmFichaPrePedido.aData.filter(value => value.PS2_NUM + value.PS2_ITEM == tpConvert.decodeObj(cChave))[0];
        var txtValorTotal = parseFloat(tpGetVal('#txtQuant_'+cChave).valor()) * parseFloat(tpGetVal('#txtPreco_'+cChave).valor());
          
        if(!parseFloat(tpGetVal('#txtTotal_'+cChave).valor())) {
            txtValorTotal = (parseFloat(tpGetVal('#txtQuant_'+cChave).valor()) * parseFloat(tpGetVal('#txtPreco_'+cChave).valor())) - parseFloat(tpGetVal('#txtDescItem_'+cChave).valor());
        } 
        var valTotal = txtValorTotal; //(txtValorTotal + parseFloat(prePedido.PS2_ICMST) + parseFloat(prePedido.PS2_ICMDA) + parseFloat(prePedido.PS2_VALIPI)) - parseFloat(prePedido.PS2_VLDESC);
    
        tpSetVal('#txtTotal_'+cChave, valTotal.toFixed(2));
        scmFichaPrePedido.itemCalculo = tpConvert.decodeObj(cChave);
        scmFichaPrePedido_calculaImpostos('L', `scmFichaPrePedido_atualizaItemGrid("${cChave}")`, `${cChave}`);
		    scmFichaPrePedido_atualizaValoresJSon(cChave);
	}
  
}

function scmFichaPrePedido_atualizaItemGrid(cChave){
    if(!empty(cChave)){
        tpParam.ClearParam();
        tpParam.AddParams('ACAO'    , 'A');
        tpParam.AddParams('ALIAS'   , 'PS2');
        tpParam.AddParams('INDICE'  , '1');
        tpParam.AddParams('CHAVE'   , tpConvert.decodeObj(cChave));
        tpParam.AddParams('FUNVALID', 'u_TPVPS2ALT(aParams)');
        tpParam.AddParams('PS2_QUANT', tpGetVal('#txtQuant_'+cChave).valor());
        tpParam.AddParams('PS2_PRECO', tpGetVal('#txtPreco_'+cChave).valor());
        tpParam.AddParams('PS2_TOTAL', tpGetVal('#txtTotal_'+cChave).valor());
        tpParam.AddParams('PS2_VLDESC', tpGetVal('#txtDescItem_'+cChave).valor());
    	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    	
        if(existBlock(typeof scmFichaPrePedidoPE_atualizaItemGrid)){
            scmFichaPrePedidoPE_atualizaItemGrid(cChave);
        }
        
        tpParam.SendFormPostASync('TABGENER', 'scmFichaPrePedido_atualizaItemCallback(oDados, \'' + cChave + '\')');
    	scmFichaPrePedido_mudaValor(cChave, 0);
        toastr.success('Valor atualizado com sucesso!')	
    }
}

//Atualiza o valor dos Totais
//--------------------------
function scmFichaPrePedido_mudaValor(cChave, valTotal){
    
    var idInputDinamico = 0
    var nTotalProx = 0
    var idTotal = $(tpSelector('.TOTAL'));
    var nTotal = 0;
    var nTotalGeral = 0;
    var nfrete = tpGetVal('#txtValorFrete');
    var nSeguro = tpGetVal('#txtValorSeguro');
    var nDespesa = tpGetVal('#txtValorDespesa');
	var nTotalImpostos  = tpGetVal('#txtTotalImpostos')
    var nProd = tpGetVal('#txtTotalProdutos');
    var nTotisDescontos = tpGetVal('#txtTotalDesconto');
    var nTotal2 = valTotal;
    
    for (var i = 0; i < idTotal.length; i++) {
        nTotalProx = tpGetVal($(tpSelector('.TOTAL'))[i].id);
        nTotal2 = tpGetVal($(tpSelector('.TOTAL'))[i].id);
        if(nTotalProx === ""){
            nTotalProx = '0'
        }
        nTotal = (nTotal + parseFloat(nTotalProx.valor()));
    }
    
    tpSetVal('#txtTotalProdutos', nTotal);
    nfrete          = scmFichaPrePedido_desformatarNumero(nfrete)
	nTotal2         = scmFichaPrePedido_desformatarNumero(nTotal2)
    nSeguro         = scmFichaPrePedido_desformatarNumero(nSeguro)
    nDespesa        = scmFichaPrePedido_desformatarNumero(nDespesa)
	nTotalImpostos  = scmFichaPrePedido_desformatarNumero(nTotalImpostos)
    nProd           = scmFichaPrePedido_desformatarNumero(nProd)
    nTotisDescontos = scmFichaPrePedido_desformatarNumero(nTotisDescontos)
    
    nTotalGeral = (nTotal + nfrete + nSeguro + nDespesa + nTotalImpostos);
    nTotalGeral = (nTotalGeral - nTotisDescontos)										   
    tpSetVal('#txtTotalGeral', nTotalGeral);
    scmFichaPrePedido_atualizaTotal();
}

function scmFichaPrePedido_atualizaItemCallback(oDados, cChave){
    let TotalProdutos = 0;
    
    if(oDados.errorcode != '00'){
        bootbox.alert(oDados.errormsg);
	 
    }else{
        $(tpSelector('.valor_mask_total')).each(function (){
            TotalProdutos +=  parseFloat($(this).val().valor());
        })
        
        tpSetVal('#txtTotalProdutos', TotalProdutos);
        scmFichaPrePedido_somaTotais(true);
        scmFichaPrePedido_atualizaTotal()
        
        cPrePedido = tpGetVal("#txtNumPrePedido")
        if (!empty(cPrePedido)){
            scmFichaPrePedido_itens_createGrid(cPrePedido)
        }
    }
  
}

function scmFichaPrePedido_visualizaMensagem(){
   bootbox.alert(tpGetVal('#PS2_IDPSM','PSM_MSG'));
}
    
function scmFichaPrePedido_detalheProduto() {
    let codProd = getSelect2(tpSelector('#ddlProdutos'));
    if(codProd == ""){
        toastr.warning("Por favor, selecione um Produto.")
    }
    else {
        TPnavpop('scmFichaProduto.html' , `scmFichaProduto_init("${codProd}")`, '70%');
    }
}

function scmFichaPrePedido_ddlLocal() {

	$(tpSelector("#ddlLocal")).select2({
		minimumInputLength: 2,
		dropdownAutoWidth: true,
		escapeMarkup: function (m) { return m; },
		query: function (query) {

			tpParam.ClearParam();
			tpParam.AddParams('CONSULTA', 'SCM345');
			tpParam.AddParams('PESQUISA', '%' + query.term + '%');
			tpParam.AddParams('PAGINA', '1');
			tpParam.AddParams('TAMPAG', '20');
			tpParam.AddParams('HEADER', 'N');
			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

			var ddlValue = 's.NNR_CODIGO';
			var ddlText = 's.NNR_CODIGO + " - " + s.NNR_DESCRI';
			var nomeFuncao = tpGetNomeFuncaoWSGETCONS();

			$.ajax({
				url: tpGetResourceUrl('WSGETCONS'),
				dataType: "text",
				async: true,
				data: { data1: JSON.stringify(aParams), funcao: nomeFuncao },
				success: function (ajaxData) {

					oDados = GetContentJson(ajaxData);

					if (oDados.errorcode == '00') {
						var ddlData = { results: [] }, i, j, s;
						var aData = ajustaraData(oDados);
						if (parseInt(oDados.totalreg) > 0) {
							$(aData).each(function (index, s) {
								ddlData.results.push({ id: eval(ddlValue), text: eval(ddlText) });
							});
						}
						query.callback(ddlData);
					}
					else {
						console.log('Não conformidade:' + data.errorcode + " - " + data.errormsg);
					}
				},
				error: function (err) {
					console.log('Nao conformidade solicitacao ajax');
				}
			});
		}
	});
}

function scmFichaPrePedido_getRateioPorEntContabil( codEntidade, itemEntidade ) {

	scmFichaPrePedido.dados_rateio_cc			= []
	scmFichaPrePedido.dados_rateio_conta		= []
	scmFichaPrePedido.dados_rateio_item_conta	= []
	scmFichaPrePedido.dados_rateio_classe_valor	= []
	scmFichaPrePedido.dados_rateio_pco          = [];
	
	tpParam.ClearParam()
	tpParam.AddParams('CONSULTA', 'SCM410')
	tpParam.AddParams('ENTIDADE', "PS2")
	tpParam.AddParams('CODENT'  , codEntidade)
	tpParam.AddParams('ITMENT'  , itemEntidade)
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

	let oDados = tpParam.SendFormPost('WSGETCONS')

	if(oDados.errorcode == '00') {
        let aData = ajustaraData(oDados)

        let cc          = aData.filter( data => data.ENTIDADE == 'CTT' )
        let conta       = aData.filter( data => data.ENTIDADE == 'CT1' )
        let item_conta  = aData.filter( data => data.ENTIDADE == 'CTD' )
        let clvl        = aData.filter( data => data.ENTIDADE == 'CTH' )
		let pco         = aData.filter( data => data.ENTIDADE == 'PCO' )																

        cc.forEach( centro_custo => {
			if( !empty(centro_custo.CODIGO) ) {
				scmFichaPrePedido.dados_rateio_cc.push({
					"PSU_CC"    : centro_custo.CODIGO,
					"PSU_DCC"   : centro_custo.DESCRI,
					"PSU_PERC"  : centro_custo.PERC,
					"PSU_VALOR" : centro_custo.PSU_VALOR,
					"PSU_QTD"   : centro_custo.PSU_QTD,
				})
			}
        })

        conta.forEach( conta_contabil => {
			if( !empty(conta_contabil.CODIGO) ) {
				scmFichaPrePedido.dados_rateio_conta.push({
					"PSU_CONTA"    : conta_contabil.CODIGO,
					"PSU_DCONTA"   : conta_contabil.DESCRI,
					"PSU_PERC"     : conta_contabil.PERC,
					"PSU_VALOR"    : conta_contabil.PSU_VALOR,
					"PSU_QTD"      : conta_contabil.PSU_QTD,
				})
			}
        })

        item_conta.forEach( item_conta_contabil => {
			if( !empty(item_conta_contabil.CODIGO) ) {
				scmFichaPrePedido.dados_rateio_item_conta.push({
					"PSU_ITMCTA"    : item_conta_contabil.CODIGO,
					"PSU_DITCTA"    : item_conta_contabil.DESCRI,
					"PSU_PERC"      : item_conta_contabil.PERC,
					"PSU_VALOR"     : item_conta_contabil.PSU_VALOR,
					"PSU_QTD"       : item_conta_contabil.PSU_QTD,
				})
			}
        })

        clvl.forEach( classe_valor => {
			if( !empty(classe_valor.CODIGO) ) {
				scmFichaPrePedido.dados_rateio_classe_valor.push({
					"PSU_CLVL"    : classe_valor.CODIGO,
					"PSU_DCLVL"   : classe_valor.DESCRI,
					"PSU_PERC"    : classe_valor.PERC,
					"PSU_VALOR"   : classe_valor.PSU_VALOR,
					"PSU_QTD"     : classe_valor.PSU_QTD,				  
				})
			}
        })
		
        pco.forEach( planilha_conta => { 
            if( !empty(planilha_conta.CODIGO) ) {
                scmFichaPrePedido.dados_rateio_pco.push({
                    "PSU_CODPLA"  : planilha_conta.CODIGO,
                    "PSU_DCPLA"   : planilha_conta.DESCRI,
                    "PSU_CO"      : planilha_conta.CODIGO_1,
                    "PSU_DCCO"    : planilha_conta.DESCRI_1,
                    "PSU_PERC"    : planilha_conta.PERC,
                    "PSU_VALOR"   : planilha_conta.PSU_VALOR,
                    "PSU_QTD"     : planilha_conta.PSU_QTD,
                    "PSU_ENTCTB"  : "PCO"
                })
            }
        })
	}
}

function scmFichaPrePedido_ratear( entidade_contabil ) {
    let dados_rateio = null

    switch (entidade_contabil) {
        case 'CTT':
            dados_rateio = scmFichaPrePedido.dados_rateio_cc
        break;
        case 'CT1':
            dados_rateio = scmFichaPrePedido.dados_rateio_conta
        break;
        case 'CTD':
            dados_rateio = scmFichaPrePedido.dados_rateio_item_conta
        break;
        case 'CTH':
            dados_rateio = scmFichaPrePedido.dados_rateio_classe_valor
        break;
		case 'PCO':
            dados_rateio = scmFichaPrePedido.dados_rateio_pco
        break;	  
        default: 
        break;
    }

    TPnavpop('scmRateio.html', `scmRateio_init('', '', '', '', '','${entidade_contabil}', '${tpConvert.encodeObj(dados_rateio)}', 'scmFichaPrePedido_ratearCallback( "${entidade_contabil}", dadosRateioB64 )',  'PP' , '${scmFichaPrePedido.ACAO}' )`, '70%')
}

function scmFichaPrePedido_ratearCallback( entidade, dadosRateioB64 ) {
    switch (entidade) {
        case 'CTT':
            scmFichaPrePedido.dados_rateio_cc = tpConvert.decodeObj(dadosRateioB64)
        break;
        case 'CT1':
            scmFichaPrePedido.dados_rateio_conta = tpConvert.decodeObj(dadosRateioB64)
        break;
        case 'CTD':
            scmFichaPrePedido.dados_rateio_item_conta = tpConvert.decodeObj(dadosRateioB64)
        break;
        case 'CTH':
            scmFichaPrePedido.dados_rateio_classe_valor = tpConvert.decodeObj(dadosRateioB64)
        break;
		case 'PCO':
            scmFichaPrePedido.dados_rateio_pco = tpConvert.decodeObj(dadosRateioB64)
        break;  
        default: 
        break;
    }
}

function scmFichaPrePedido_processaRateioGeral() {
    var qtdItem	        = parseFloat((tpGetVal('txtQtde') || '0').valor()) 
	var valorItem       = parseFloat((tpGetVal('#txtValor') || '0').valor());
	var ValorTtItem     = qtdItem * valorItem ;
    let rateio_geral = []
    
    if (!empty(scmFichaPrePedido.dados_rateio_cc)){
        scmFichaPrePedido.dados_rateio_cc.forEach( cc => {
            if( !empty(scmFichaPrePedido.dados_rateio_conta) ) {
    
                scmFichaPrePedido.dados_rateio_conta.forEach( conta =>  {
                    if( !empty(scmFichaPrePedido.dados_rateio_item_conta)) {
    
                        scmFichaPrePedido.dados_rateio_item_conta.forEach( itemConta => {
                            if( !empty(scmFichaPrePedido.dados_rateio_classe_valor)) {
    
                                scmFichaPrePedido.dados_rateio_classe_valor.forEach( classeValor => {
                                    rateio_geral.push({ 
                                                        "PSU_CC"    : cc.PSU_CC, 
                                                        "PSU_DCC"   : cc.PSU_DCC, 
                                                        "PSU_CONTA" : conta.PSU_CONTA, 
                                                        "PSU_DCONTA": conta.PSU_DCONTA, 
                                                        "PSU_ITMCTA": itemConta.PSU_ITMCTA, 
                                                        "PSU_DITCTA": itemConta.PSU_DITCTA, 
                                                        "PSU_CLVL"  : classeValor.PSU_CLVL,
                                                        "PSU_DCLVL" : classeValor.PSU_DCLVL,
                                                        "PSU_PERC"  : ((cc.PSU_PERC/100) * (conta.PSU_PERC/100) * (itemConta.PSU_PERC/100) * (classeValor.PSU_PERC/100)) * 100,
														"PSU_QTD"   : ((cc.PSU_QTD/qtdItem) * (conta.PSU_QTD/qtdItem) * (itemConta.PSU_QTD/qtdItem) * (classeValor.PSU_QTD/qtdItem)) * qtdItem,
                                                        "PSU_VALOR" : ((cc.PSU_VALOR/ValorTtItem) * (conta.PSU_VALOR/ValorTtItem) * (itemConta.PSU_VALOR/ValorTtItem) * (classeValor.PSU_VALOR/ValorTtItem)) * ValorTtItem,
                                                        "PSU_ENTIDA": "PS2",
                                                        "PSU_ENTCTB": "ALL",
                                                        "PSU_TIPO"  : "N"
                                                    })
                                })
    
                            } else {
    
                                rateio_geral.push({ 
                                    "PSU_CC"    : cc.PSU_CC, 
                                    "PSU_DCC"   : cc.PSU_DCC, 
                                    "PSU_CONTA" : conta.PSU_CONTA, 
                                    "PSU_DCONTA": conta.PSU_DCONTA, 
                                    "PSU_ITMCTA": itemConta.PSU_ITMCTA, 
                                    "PSU_DITCTA": itemConta.PSU_DITCTA, 
                                    "PSU_PERC"  : ((cc.PSU_PERC/100) * (conta.PSU_PERC/100) * (itemConta.PSU_PERC/100)) * 100,
									"PSU_QTD"   : ((cc.PSU_QTD/qtdItem) * (conta.PSU_QTD/qtdItem) * (itemConta.PSU_QTD/qtdItem)) * qtdItem,
                                    "PSU_VALOR" : ((cc.PSU_VALOR/ValorTtItem) * (conta.PSU_VALOR/ValorTtItem) * (itemConta.PSU_VALOR/ValorTtItem)) * ValorTtItem,
                                    "PSU_ENTIDA": "PS2",
                                    "PSU_ENTCTB": "ALL",
                                    "PSU_TIPO"  : "N"
                                })
    
                            }
                        })
    
                    } else if( !empty(scmFichaPrePedido.dados_rateio_classe_valor)) {
    
                        scmFichaPrePedido.dados_rateio_classe_valor.forEach( classeValor => {
                            rateio_geral.push({ 
                                                "PSU_CC"    : cc.PSU_CC, 
                                                "PSU_DCC"   : cc.PSU_DCC, 
                                                "PSU_CONTA" : conta.PSU_CONTA, 
                                                "PSU_DCONTA": conta.PSU_DCONTA, 
                                                "PSU_CLVL"  : classeValor.PSU_CLVL,
                                                "PSU_DCLVL" : classeValor.PSU_DCLVL,
                                                "PSU_PERC"  : ((cc.PSU_PERC/100) * (conta.PSU_PERC/100) * (itemConta.PSU_PERC/100) * (classeValor.PSU_PERC/100)) * 100,
												"PSU_QTD"   : ((cc.PSU_QTD/qtdItem) * (conta.PSU_QTD/qtdItem) * (itemConta.PSU_QTD/qtdItem) * (classeValor.PSU_QTD/qtdItem)) * qtdItem,
                                                "PSU_VALOR" : ((cc.PSU_VALOR/ValorTtItem) * (conta.PSU_VALOR/ValorTtItem) * (itemConta.PSU_VALOR/ValorTtItem) * (classeValor.PSU_VALOR/ValorTtItem)) * ValorTtItem,
                                                "PSU_ENTIDA": "PS2",
                                                "PSU_ENTCTB": "ALL",
                                                "PSU_TIPO"  : "N"
                                            })
                        })
    
                    } else {
    
                        rateio_geral.push({ 
                            "PSU_CC"    : cc.PSU_CC, 
                            "PSU_DCC"   : cc.PSU_DCC, 
                            "PSU_CONTA" : conta.PSU_CONTA, 
                            "PSU_DCONTA": conta.PSU_DCONTA,
                            "PSU_PERC"  : ((cc.PSU_PERC/100) * (conta.PSU_PERC/100)) * 100,
							"PSU_QTD"   : ((cc.PSU_QTD/qtdItem) * (conta.PSU_QTD/qtdItem)) * qtdItem,
                            "PSU_VALOR" : ((cc.PSU_VALOR/ValorTtItem) * (conta.PSU_VALOR/ValorTtItem)) * ValorTtItem,
                            "PSU_ENTIDA": "PS2",
                            "PSU_ENTCTB": "ALL",
                            "PSU_TIPO"  : "N"
                        })
    
                    }
    
                })
    
            } else if( !empty(scmFichaPrePedido.dados_rateio_item_conta)) {
    
                scmFichaPrePedido.dados_rateio_item_conta.forEach( itemConta => {
                    if( !empty(scmFichaPrePedido.dados_rateio_classe_valor)) {
    
                        scmFichaPrePedido.dados_rateio_classe_valor.forEach( classeValor => {
                            rateio_geral.push({ 
                                                "PSU_CC"    : cc.PSU_CC, 
                                                "PSU_DCC"   : cc.PSU_DCC, 
                                                "PSU_ITMCTA": itemConta.PSU_ITMCTA, 
                                                "PSU_DITCTA": itemConta.PSU_DITCTA, 
                                                "PSU_CLVL"  : classeValor.PSU_CLVL,
                                                "PSU_DCLVL" : classeValor.PSU_DCLVL,
                                                "PSU_PERC"  : ((cc.PSU_PERC/100) * (itemConta.PSU_PERC/100) * (classeValor.PSU_PERC/100)) * 100,
												"PSU_QTD"   : ((cc.PSU_QTD/qtdItem) * (itemConta.PSU_QTD/qtdItem) * (classeValor.PSU_QTD/qtdItem)) * qtdItem,
                                                "PSU_VALOR" : ((cc.PSU_VALOR/ValorTtItem) * (itemConta.PSU_VALOR/ValorTtItem) * (classeValor.PSU_VALOR/ValorTtItem)) * ValorTtItem,
                                                "PSU_ENTIDA": "PS2",
                                                "PSU_ENTCTB": "ALL",
                                                "PSU_TIPO"  : "N"
                                            })
                        })
    
                    } else {
    
                        rateio_geral.push({ 
                            "PSU_CC"    : cc.PSU_CC, 
                            "PSU_DCC"   : cc.PSU_DCC, 
                            "PSU_ITMCTA": itemConta.PSU_ITMCTA, 
                            "PSU_DITCTA": itemConta.PSU_DITCTA, 
                            "PSU_PERC"  : ((cc.PSU_PERC/100) * (itemConta.PSU_PERC/100)) * 100,
							"PSU_QTD"   : ((cc.PSU_QTD/qtdItem) * (itemConta.PSU_QTD/qtdItem)) * qtdItem,
                            "PSU_VALOR" : ((cc.PSU_VALOR/ValorTtItem) * (itemConta.PSU_VALOR/ValorTtItem)) * ValorTtItem,
                            "PSU_ENTIDA": "PS2",
                            "PSU_ENTCTB": "ALL",
                            "PSU_TIPO"  : "N"
                        })
    
                    }
                })
    
            } else if( !empty(scmFichaPrePedido.dados_rateio_classe_valor)) {
    
                scmFichaPrePedido.dados_rateio_classe_valor.forEach( classeValor => {
                    rateio_geral.push({ 
                                        "PSU_CC"    : cc.PSU_CC, 
                                        "PSU_DCC"   : cc.PSU_DCC, 
                                        "PSU_CLVL"  : classeValor.PSU_CLVL,
                                        "PSU_DCLVL" : classeValor.PSU_DCLVL,
                                        "PSU_PERC"  : ((cc.PSU_PERC/100) * (classeValor.PSU_PERC/100)) * 100,
										"PSU_QTD"   : ((cc.PSU_QTD/qtdItem) * (classeValor.PSU_QTD/qtdItem)) * qtdItem,
                                        "PSU_VALOR" : ((cc.PSU_VALOR/ValorTtItem) * (classeValor.PSU_VALOR/ValorTtItem)) * ValorTtItem,
                                        "PSU_ENTIDA": "PS2",
                                        "PSU_ENTCTB": "ALL",
                                        "PSU_TIPO"  : "N"
                                    })
                })
    
            } else {
    
                rateio_geral.push({ 
                    "PSU_CC"    : cc.PSU_CC, 
                    "PSU_DCC"   : cc.PSU_DCC,
                    "PSU_PERC"  : +cc.PSU_PERC,
					"PSU_VALOR" : +cc.PSU_VALOR,
                    "PSU_QTD"   : +cc.PSU_QTD,		  
                    "PSU_ENTIDA": "PS2",
                    "PSU_ENTCTB": "ALL",
                    "PSU_TIPO"  : "N"
                })
    
            }
        })
    }
    
    if (!empty(scmFichaPrePedido.dados_rateio_pco)){
        scmFichaPrePedido.dados_rateio_pco.forEach( pco => {
            rateio_geral.push({ 
                    "PSU_CODPLA": pco.PSU_CODPLA, 
                    "PSU_CO"    : pco.PSU_CO,
    				"PSU_DCPLA" : pco.PSU_DCPLA,
    				"PSU_DCCO"  : pco.PSU_DCCO,
                    "PSU_PERC"  : +pco.PSU_PERC,
                    "PSU_VALOR" : +pco.PSU_VALOR,
                    "PSU_QTD"   : +pco.PSU_QTD,
                    "PSU_ENTIDA": "PS2",
                    "PSU_ENTCTB": "PCO",
                    "PSU_TIPO"  : "N"
                });
        });
    }
    
    return (!empty(rateio_geral) ? rateio_geral : '' )
}

function scmFichaPrePedido_changeTipoFrete() {
    var idInputDinamico = 0
    var nTotalProx = 0
    var idTotal = $(tpSelector('.TOTAL'));
    var nTotal = 0;
    var nTotalGeral = 0;
    var nfrete = tpGetVal('#txtValorFrete');
    var nSeguro = tpGetVal('#txtValorSeguro');
    var nDespesa = tpGetVal('#txtValorDespesa');
    var nProd = tpGetVal('#txtTotalProdutos');
    var nTotisDescontos = tpGetVal('#txtTotalDesconto');
    var nTotal2 = valTotal;
    
    for (var i = 0; i < idTotal.length; i++) {
        nTotalProx = tpGetVal($(tpSelector('.TOTAL'))[i].id);
        nTotal2 = tpGetVal($(tpSelector('.TOTAL'))[i].id);
        if(nTotalProx === ""){
            nTotalProx = '0'
            nTotal2 = '0'
        }
        nTotal = (nTotal + parseFloat(nTotalProx));
    }
    
    tpSetVal('#txtTotalProdutos', nTotal);
    nfrete = scmFichaPrePedido_desformatarNumero(nfrete)
	nTotal2 = scmFichaPrePedido_desformatarNumero(nTotal2)
    nSeguro = scmFichaPrePedido_desformatarNumero(nSeguro)
    nDespesa = scmFichaPrePedido_desformatarNumero(nDespesa)
    nProd = scmFichaPrePedido_desformatarNumero(nProd)
    nTotisDescontos = scmFichaPrePedido_desformatarNumero(nTotisDescontos)
    
    nTotalGeral = (nTotal + nfrete + nSeguro + nDespesa);
    nTotalGeral = (nTotalGeral - nTotisDescontos)

    nTotalGeral = formatNumber(nTotalGeral,2)
    tpSetVal('#txtTotalGeral', nTotalGeral.valor());
}

function scmFichaPrePedido_mostralinkApuracao(){
    if (scmFichaPrePedido.ACAO == 'V'){
        $(tpSelector('#btnApurarCondPag')).css('display', 'none')
    }else{
        if(tpGetVal('#ddlCondPag') == ''){
            $(tpSelector('#btnApurarCondPag')).css('display', 'none')
        }
        else{
            $(tpSelector('#btnApurarCondPag')).css('display', 'inline')
        }
    }
}

function scmFichaPrePedido_apuraCondPag(){
    let totalPed        = tpGetVal('#txtTotalGeral');
    let totalLiq        = $(tpSelector('#idTotalGeral')).html().replace(/\./g, "").replace(/\,/g, ".");
    let condPag         = tpGetVal('#ddlCondPag');
    let dtbase          = moment().format('YYYYMMDD');
    var nInputDinamico  = $(tpSelector('.valorCondPag')).length;
    
    if(totalPed == ''){
        toastr.warning('Não é possivel a explosão dos vencimentos e parcelas. Por favor, insira um item')
    }
    else{
       if(nInputDinamico > 0){
            bootbox.confirm({
                message:`Essa ação ira reprocessar todos os vencimentos.`,
                buttons: {                                                                                                                                                                  
                        confirm: {
                            label: 'OK',
                            className: 'btn-success'
                        },
                     },
                callback:function (result) {
                   if(result == true){
						tpParam.ClearParam();
                        tpParam.AddParams('CONSULTA'    , 'SCM442');
                	    tpParam.AddParams('CONDICAO'    , condPag);
                	    tpParam.AddParams('VALOR'       , parseFloat(totalLiq));
                	    tpParam.AddParams('DTBASE'      , dtbase);
						tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
                	
                	    var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_apuraCondPagCallbak(oDados)');
					}
                }       
            });
        } 
        else{
                tpParam.ClearParam();
                tpParam.AddParams('CONSULTA'    , 'SCM442');
            	tpParam.AddParams('CONDICAO'    , condPag);
            	tpParam.AddParams('VALOR'       , parseFloat(totalLiq));
            	tpParam.AddParams('DTBASE'      , dtbase);
				tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
            	
            	var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_apuraCondPagCallbak(oDados)');
        }
    }
}

function scmFichaPrePedido_apuraCondPagCallbak(oDados){
    if(oDados.errorcode == "00"){
        var aData = ajustaraData(oDados)
        
        // Limpa as Parcelas atuais
        $(tpSelector('#parcelas')).html('');
        
        aData.forEach((el, index) => {
            scmFichaPrePedido_parcelasCondPag(el);
        })
        
    }
}

function scmFichaPrePedido_changePS2_MODALI(){
    $(tpSelector("#divInfoContratoParceria")).hide();
    
    if (tpGetVal("#PS2_MODALI") == "C"){
        if (getTetrisParams('SCM_EXIBE_CONTRATO_SC_PRE_PEDIDO', 'SCM') == 'S'){
            $(tpSelector('#divDadosContrato')).attr('hidden', false);
            $(tpSelector('#divItensContrato')).attr('hidden', false);
            $(tpSelector('#divCondicoesFornecimento')).attr('hidden', true);
            $(tpSelector('#divValoresTotais')).attr('hidden', true);
            
            scmFichaPrePedido_initDdlContratoGCT()
			scmFichaPrePedido_changeFornecedor()
        }
        
        $(tpSelector('#divEnviaEmail')).attr('hidden', true);
        $(tpSelector('#divIPI')).attr('hidden', true);
        $(tpSelector('#divImpostosItem')).attr('hidden', true);
        $(tpSelector('#divValorDesc')).attr('hidden', true);
        $(tpSelector('#divAdiantamento')).attr('hidden', true);
        $(tpSelector('#divDocumentos')).attr('hidden', true);
        $(tpSelector('#DivPCO')).attr('hidden', true);
        $(tpSelector('#divContingencia')).attr('hidden', true);
        $(tpSelector('#divPS2_OP')).attr('hidden', true);
        $(tpSelector('#DivSubDesc')).attr('hidden', true);
        $(tpSelector('#divLocal')).attr('hidden', true);
        $(tpSelector('#divPS2_IDPSN')).attr('hidden', true);
        $(tpSelector('#contentObsTipoSc')).attr('hidden', true);
        $(tpSelector('#btnFinalizar'))[0].innerHTML = '<i class="fa fa-check"></i>&nbsp;Gerar Contrato'
        $(tpSelector('#btnFinalizar'))[0].innerHTML = '<i class="fa fa-check"></i>&nbsp;Gerar Contrato'
        $(tpSelector('#btnFinalizarAguarde'))[0].innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp;Gerar Contrato'
    }else{
        $(tpSelector('#divDadosContrato')).attr('hidden', true);
        $(tpSelector('#divItensContrato')).attr('hidden', true);
        $(tpSelector('#divEnviaEmail')).attr('hidden', false);
        $(tpSelector('#divIPI')).attr('hidden', false);
        $(tpSelector('#divImpostosItem')).attr('hidden', false);
        $(tpSelector('#divValorDesc')).attr('hidden', false);
        $(tpSelector('#divAdiantamento')).attr('hidden', false);
        $(tpSelector('#divDocumentos')).attr('hidden', false);
        //$(tpSelector('#divCONDPAG')).attr('hidden', false);
        $(tpSelector('#DivPCO')).attr('hidden', (scmFichaPrePedido.habilitaPCO == 'S' ? false : true));
        $(tpSelector('#divContingencia')).attr('hidden', (scmFichaPrePedido.habilitaContingencia == 'S' ? false : true));
        $(tpSelector('#divPS2_OP')).attr('hidden', (scmFichaPrePedido.habilitaCampoOrdemProd == 'S' ? false : true));
        $(tpSelector('#DivSubDesc')).attr('hidden', (scmFichaPrePedido.habilitaDescricaoSubst == 'S' ? false : true));
        $(tpSelector('#divLocal')).attr('hidden', (scmFichaPrePedido.habilitaCampoLocal == 'S' ? false : true));
        $(tpSelector('#divPS2_IDPSN')).attr('hidden', (getTetrisParams('UTILIZA_TIPO_SC') == 'S' ? false : true));
        $(tpSelector('#contentObsTipoSc')).attr('hidden', (!empty(tpGetVal(tpSelector('#txtObsevaçãoTipoSC'))) ? false : true));
        $(tpSelector('#btnFinalizar'))[0].innerHTML = '<i class="fa fa-check"></i>&nbsp;Gerar Pedido'
        $(tpSelector('#btnFinalizarAguarde'))[0].innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp;Gerar Pedido'
        $(tpSelector('#divCondicoesFornecimento')).attr('hidden', false); 
        $(tpSelector('#divValoresTotais')).attr('hidden', false); 
        
		if(tpGetVal('PS2_MODALI') == 'A') {
			$(tpSelector("#divInfoContratoParceria")).show();
			$(tpSelector('#btnFinalizar'))[0].innerHTML = '<i class="fa fa-check"></i>&nbsp;Gerar Cont. Parceria'
			$(tpSelector('#btnFinalizarAguarde'))[0].innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp;Gerar Cont. Parceria'
			scmFichaPrePedido_createGridItensContrato()
        }else{
			$(tpSelector('#btnFinalizar'))[0].innerHTML = '<i class="fa fa-check"></i>&nbsp;Gerar Pedido'
			$(tpSelector('#btnFinalizarAguarde'))[0].innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp;Gerar Pedido'
		}
	}
	
	if (existBlock(typeof scmFichaPrePedidoPE_changePS2_MODALI)) {
        scmFichaPrePedidoPE_changePS2_MODALI();
    } 
}

function scmFichaPrePedido_parcelasCondPag( el ) {
    var cDisabled      = scmFichaPrePedido.ACAO == 'V' ? 'disabled' : '';
    var nInputDinamico = $(tpSelector('.valorCondPag')).length; 
    
    nInputDinamico = (parseInt(nInputDinamico) + 1).toString().length == 1 ? ('0' + (parseInt(nInputDinamico) + 1)) : (parseInt(nInputDinamico) + 1).toString();
    
        cHtm = `
            <div id="aPagaDiv${nInputDinamico}" class="row valorTotall">
                ${scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C'? `
                <div id="divANEXOPA${nInputDinamico}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="form-group">
                        <label for="ANEXOPA${nInputDinamico}" class="control-label">Anexos ${nInputDinamico}</label>
                        <label for="ANEXOPA${nInputDinamico}" class="error"></label>
                        <input id="ANEXOPA${nInputDinamico}"type="text" class="form-control tp-anexo anexopa campo-nota" ${cDisabled}>  
                    </div>
                </div>` : ''}
                
                <div id="DivVENC${nInputDinamico}" class="col-xs-6 col-sm-4 col-md-2 form-group" >
                    <label class="control-label">Vencimento ${nInputDinamico}</label>
                    <label for="VENC${nInputDinamico}" class="error"></label>
                    <div class="input-icon right">
                        <i class="fa fa-calendar"></i>
                        <input id="VENC${nInputDinamico}" name="txtDataInsp" type="text" class="form-control valorVenc venc tp-date datepicker param campo-nota" ${cDisabled}/>
                    </div>
                </div>
        
                <div id="divPARCELA${nInputDinamico}"  class="col-xs-12 col-sm-7 col-md-8 col-lg-2">
                    <div class="form-group">
                        <label for="PARCELA${nInputDinamico}" class="control-label">Valor Parcela ${nInputDinamico}</label>
                        <label for="PARCELA${nInputDinamico}" class="error"></label>
                        <input id="PARCELA${nInputDinamico}"type="text" class="form-control valorCondPag nValorParc tp-valor2 text-right param campo-nota" style="text-align: right;" ${cDisabled}>  
                    </div>
                </div>
                
                ${scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C' ? `
                    <div class="col-xs-12 col-md-1" id="divGERAPA${nInputDinamico}">
                            <div class="form-group">
                            <label for="GERAPA${nInputDinamico}" class="control-label">Gera PA ?</label>
                            <label for="GERAPA${nInputDinamico}" class="error"></label>
                            <select id="GERAPA${nInputDinamico}" onchange="scmFichaPrePedido_changeGerarPa(this)" class="form-control campo-nota pa" style="padding: 5px" ${cDisabled}>
                                <option selected value="N">Não</option>
                                <option value="S">Sim</option>
                            </select>
                        </div>  
                    </div> ` : ''
                }
               
				${
                    scmFichaPrePedido.defineModeloCondPag == "C" ? `
                        <div class="col-xs-12 ${scmFichaPrePedido.habilitaGerarPa == 'S' ? 'col-md-2' : 'col-md-3'}" id="divFORMPG${nInputDinamico}">
                            <div class="form-group">
                                <label for="PS2_FORMPG${nInputDinamico}" class="control-label">Forma de Pagamento</label>
                                <label for="PS2_FORMPG${nInputDinamico}" class="error"></label>
                                <select id="PS2_FORMPG${nInputDinamico}" class="form-control campo-nota formpg" style="${scmFichaPrePedido.habilitaGerarPa == 'S' ? 'padding: 4px' : ''}" onchange="scmFichaPrePedido_changeTipoFormaPagamento('${nInputDinamico}')" ${cDisabled}>
                                    <option value=""></option>
                                    <option value="BOL">Pagamento de Boleto</option>
                                    <option value="PIX">Pagamento PIX QR-Code</option>
                                    <option value="TRA">Transferência Bancária</option>
                                    <option value="CAI">Caixa</option>
                                </select>
                            </div>  
                        </div>
                        <div id="camposFormaPagamento${nInputDinamico}"></div> ` :''
                }
                
                
                <div class="col-xs-12 col-sm-1 col-lg-1">
                    <div class="form-group">
                        <button type="button" class="btn btn-danger campo-nota" style="margin-top: 25px" onclick="scmFichaPrePedido_apagaCampoVenc('aPagaDiv${nInputDinamico}')"  ${cDisabled}>
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            `;

    // colocar o html das parcelas.
    $(tpSelector('#parcelas')).append(cHtm);
    // Seta os valores
    TetrisDefaultMaskAll();
    tpSetVal(`VENC${nInputDinamico}`, el.VENC)
    tpSetVal(`PARCELA${nInputDinamico}`, el.VALOR)
    scmFichaPrePedido.nInputDinamico = nInputDinamico;
    
    if (nInputDinamico == "01"){
        tpSetVal('PS2_NFVENC', el.VENC) 
    }
}

function scmFichaPrePedido_parcelas( lLimpa, el ) {
    // se foi passado parametro para limpar
    if (lLimpa) {
        $(tpSelector('#parcelas')).html('');
    }
    
    var nInputDinamico = $(tpSelector('.valorCondPag')).length; 
    
    nInputDinamico = (parseInt(nInputDinamico) + 1).toString().length == 1 ? ('0' + (parseInt(nInputDinamico) + 1)) : (parseInt(nInputDinamico) + 1).toString();
    
    if(parseInt(nInputDinamico) > 9)   {
        toastr.warning('Atingido o limite máximo de 9 Condições de Pagamento')
    } 
    else{
        
        if(scmFichaPrePedido.ACAO == 'V'){
            cHtm = `
                <div id="aPagaDiv${nInputDinamico}" class="row valorTotall">
                    <div id="DivVENC${nInputDinamico}" class="col-xs-6 col-sm-4 col-md-2 form-group" >
                        <label class="control-label">Vencimento ${nInputDinamico}</label>
                        <label for="VENC${nInputDinamico}" class="error"></label>
                        <div class="input-icon right">
                            <i class="fa fa-calendar"></i>
                            <input id="VENC${nInputDinamico}" disabled="disabled" name="txtDataInsp" type="text" class="form-control valorVenc venc tp-date datepicker param campo-nota"  />
                        </div>
                    </div>
            
                    <div id="divPARCELA${nInputDinamico}"  class="col-xs-12 col-sm-7 col-md-8 col-lg-2">
                        <div class="form-group">
                            <label for="PARCELA${nInputDinamico}" class="control-label">Valor Parcela ${nInputDinamico}</label>
                            <label for="PARCELA${nInputDinamico}" class="error"></label>
                            <input id="PARCELA${nInputDinamico}" type="text" disabled="disabled" class="form-control valorCondPag nValorParc tp-valor2 text-right param campo-nota" style="text-align: right;">  
                        </div>
                    </div>
                    
                    <div class="col-xs-12 col-sm-1 col-lg-1">
                        <div class="form-group">					   
                            <button type="button" disabled="disabled" class="btn btn-danger campo-nota" style="margin-top: 25px" onclick="scmFichaPrePedido_apagaCampoVenc('aPagaDiv${nInputDinamico}')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                `;
        }
        else{
          cHtm = `
    
                <div id="aPagaDiv${nInputDinamico}" class="row valorTotall">
                    ${scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C'? `
                    <div id="divANEXOPA${nInputDinamico}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                            <label for="ANEXOPA${nInputDinamico}" class="control-label">Anexos ${nInputDinamico}</label>
                            <label for="ANEXOPA${nInputDinamico}" class="error"></label>
                            <input id="ANEXOPA${nInputDinamico}"type="text" class="form-control tp-anexo anexopa campo-nota">  
                        </div>
                    </div>` : ''}
                    <div id="DivVENC${nInputDinamico}" class="col-xs-6 col-sm-4 col-md-2 form-group" >
                        <label class="control-label">Vencimento ${nInputDinamico}</label>
                        <label for="VENC${nInputDinamico}" class="error"></label>
                        <div class="input-icon right">
                            <i class="fa fa-calendar"></i>
                            <input id="VENC${nInputDinamico}" name="txtDataInsp" type="text" class="form-control valorVenc venc tp-date datepicker param campo-nota"  />
                        </div>
                    </div>
            
                    <div id="divPARCELA${nInputDinamico}"  class="col-xs-12 col-sm-7 col-md-8 col-lg-2">
                        <div class="form-group">
                            <label for="PARCELA${nInputDinamico}" class="control-label">Valor Parcela ${nInputDinamico}</label>
                            <label for="PARCELA${nInputDinamico}" class="error"></label>
                            <input id="PARCELA${nInputDinamico}"type="text" class="form-control valorCondPag nValorParc tp-valor2 text-right param campo-nota" style="text-align: right;">  
                        </div>
                    </div>
                    
                    ${scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C' ? `
                        <div class="col-xs-12 col-md-1" id="divGERAPA${nInputDinamico}">
                                <div class="form-group">
                                <label for="GERAPA${nInputDinamico}" class="control-label">Gera PA ?</label>
                                <label for="GERAPA${nInputDinamico}" class="error"></label>
                                <select id="GERAPA${nInputDinamico}" onchange="scmFichaPrePedido_changeGerarPa(this)" class="form-control campo-nota pa" style="padding: 5px">
                                    <option selected value="N">Não</option>
                                    <option value="S">Sim</option>
                                </select>
                            </div>  
                        </div> ` : ''
                    }
                   
    				${
                        scmFichaPrePedido.defineModeloCondPag == "C" ? `
                            <div class="col-xs-12 ${scmFichaPrePedido.habilitaGerarPa == 'S' ? 'col-md-2' : 'col-md-3'}" id="divFORMPG${nInputDinamico}">
                                <div class="form-group">
                                    <label for="PS2_FORMPG${nInputDinamico}" class="control-label">Forma de Pagamento</label>
                                    <label for="PS2_FORMPG${nInputDinamico}" class="error"></label>
                                    <select id="PS2_FORMPG${nInputDinamico}" class="form-control campo-nota formpg" style="${scmFichaPrePedido.habilitaGerarPa == 'S' ? 'padding: 4px' : ''}" onchange="scmFichaPrePedido_changeTipoFormaPagamento('${nInputDinamico}')">
                                        <option value=""></option>
                                        <option value="BOL">Pagamento de Boleto</option>
                                        <option value="PIX">Pagamento PIX QR-Code</option>
                                        <option value="TRA">Transferência Bancária</option>
                                        <option value="CAI">Caixa</option>
                                    </select>
                                </div>  
                             </div>
                            <div id="camposFormaPagamento${nInputDinamico}"></div> ` :''
                    }
                
                    
                    <div class="col-xs-12 col-sm-1 col-lg-1">
                        <div class="form-group">			   
                            <button type="button" class="btn btn-danger campo-nota" style="margin-top: 25px" onclick="scmFichaPrePedido_apagaCampoVenc('aPagaDiv${nInputDinamico}')">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
            `; 
        }
        
        // colocar o html das parcelas.
        $(tpSelector('#parcelas')).append(cHtm);
        TetrisDefaultMaskAll();
        scmFichaPrePedido_atualizaTotal();
        scmFichaPrePedido.nInputDinamico = nInputDinamico;

    }

}

function scmFichaPrePedido_chamaParcelasPC() {
    let aCondPag = scmFichaPrePedido.dadosPS2;
    
    aCondPag.forEach((el, index) => {
        if (parseFloat(el.VALOR) == 0 || el.VALOR == undefined) {
            
        }
        else{
            scmFichaPrePedido_carregaParcelasPC(el); 
        }
        
    })
    
    setTimeout(function() {allPages()},1);
}

function scmFichaPrePedido_carregaParcelasPC( el ) {
   var cDisabled      = scmFichaPrePedido.ACAO == 'V' ? 'disabled' : '';
   var nInputDinamico = $('.valorCondPag').length; 
    
    nInputDinamico = (parseInt(nInputDinamico) + 1).toString().length == 1 ? ('0' + (parseInt(nInputDinamico) + 1)) : (parseInt(nInputDinamico) + 1).toString();
    
        cHtm = `
            <div id="aPagaDiv${nInputDinamico}" class="row valorTotall" style="margin-bottom: 5rem;">
                ${scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C'? `
                <div id="divANEXOPA${nInputDinamico}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div class="form-group">
                        <label for="ANEXOPA${nInputDinamico}" class="control-label">Anexos ${nInputDinamico}</label>
                        <label for="ANEXOPA${nInputDinamico}" class="error"></label>
                        <input id="ANEXOPA${nInputDinamico}"type="text" class="form-control tp-anexo anexopa campo-nota"  ${cDisabled}>  
                    </div>
                </div>` : ''}
            
                <div id="DivVENC${nInputDinamico}" class="col-xs-6 col-sm-4 col-md-2 form-group" >
                    <label class="control-label">Vencimento ${nInputDinamico}</label>
                    <label for="VENC${nInputDinamico}" class="error"></label>
                    <div class="input-icon right">
                        <i class="fa fa-calendar"></i>
                        <input id="VENC${nInputDinamico}" name="txtDataInsp" type="text" class="form-control datepicker valorVenc venc param campo-nota" ${cDisabled}/>
                    </div>
                </div>
                <div id="divPARCELA${nInputDinamico}"  class="col-xs-12 col-sm-7 col-md-8 col-lg-2">
                    <div class="form-group">
                        <label for="PARCELA${nInputDinamico}" class="control-label">Valor Parcela ${nInputDinamico}</label>
                        <label for="PARCELA${nInputDinamico}" class="error"></label>
                        <input id="PARCELA${nInputDinamico}" type="text" class="form-control valorCondPag nValorParc tp-valor2 text-right param campo-nota" style="text-align: right;" ${cDisabled}>  
                    </div>
                </div>
                ${scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C' ? `
                    <div class="col-xs-12 col-md-1" id="divGERAPA${nInputDinamico}">
                            <div class="form-group">
                            <label for="GERAPA${nInputDinamico}" class="control-label">Gera PA ?</label>
                            <label for="GERAPA${nInputDinamico}" class="error"></label>
                            <select id="GERAPA${nInputDinamico}" onchange="scmFichaPrePedido_changeGerarPa(this)" class="form-control campo-nota pa" style="padding: 5px" ${cDisabled}>
                                <option selected value="N">Não</option>
                                <option value="S">Sim</option>
                            </select>
                        </div>  
                    </div> ` : ''
                }
               
				${
                    scmFichaPrePedido.defineModeloCondPag == "C" ? `
                        <div class="col-xs-12 ${scmFichaPrePedido.habilitaGerarPa == 'S' ? 'col-md-2' : 'col-md-3'}" id="divFORMPG${nInputDinamico}">
                            <div class="form-group">
                                <label for="PS2_FORMPG${nInputDinamico}" class="control-label">Forma de Pagamento</label>
                                <label for="PS2_FORMPG${nInputDinamico}" class="error"></label>
                                <select id="PS2_FORMPG${nInputDinamico}" class="form-control campo-nota formpg" style="${scmFichaPrePedido.habilitaGerarPa == 'S' ? 'padding: 4px' : ''}" onchange="scmFichaPrePedido_changeTipoFormaPagamento('${nInputDinamico}')" ${cDisabled}>
                                    <option value=""></option>
                                    <option value="BOL">Pagamento de Boleto</option>
                                    <option value="PIX">Pagamento PIX QR-Code</option>
                                    <option value="TRA">Transferência Bancária</option>
                                    <option value="CAI">Caixa</option>
                                </select>
                            </div>  
                         </div>
                        <div id="camposFormaPagamento${nInputDinamico}"></div> ` :''
                }
                
             
                <div class="col-xs-12 col-sm-1 col-lg-1" style="padding-left: 0px;padding-top: 25px;">
                    <div class="form-group">
                        <button type="button" class="btn btn-danger campo-nota" onclick="scmFichaPrePedido_apagaCampoVenc('aPagaDiv${nInputDinamico}')" ${cDisabled}>
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            `;

    // colocar o html das parcelas.
    $('#parcelas').append(cHtm);
    
    allPages()
    
    // Seta os valores
    scmFichaPrePedido.nInputDinamico = nInputDinamico;
	
    tpSetVal(`VENC${nInputDinamico}`        , el.VENC);
    tpSetVal(`PARCELA${nInputDinamico}`     , el.VALOR);
    
    if(scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C'){
        tpSetVal(`GERAPA${nInputDinamico}`        , el.GERAPA);    
        if(el.GERAPA == 'S'){
            $(tpSelector(`#PS2_FORMPG${nInputDinamico} [value=CAI]`)).prop('disabled', true)
        }
        tpSetVal(`ANEXOPA${nInputDinamico}`       , el.ANEXO.replaceAll(';', '|'));  
    }
    
    tpSetVal(`PS2_FORMPG${nInputDinamico}`  , el.PS2_FORMPG);
    
    if(scmFichaPrePedido.ACAO == "V" || scmFichaPrePedido.ACAO == "A"){
        if( scmFichaPrePedido.defineModeloCondPag == 'C'){
            scmFichaPrePedido_changeTipoFormaPagamento(nInputDinamico, el.PS2_FINALI, el.PS2_CODBAN);
        }
       
        if(scmFichaPrePedido.ACAO == "V"){
            $(`ANEXOPA${nInputDinamico}`).TPAnexo({ readonly: true });
        }
    }
    
    tpSetVal(`PS2_CODBAR${nInputDinamico}`  , el.PS2_CODBAR);
    tpSetVal(`PS2_CHVPIX${nInputDinamico}`  , el.PS2_CHVPIX);
    // tpSetVal(`PS2_FINALI${nInputDinamico}`  , el.PS2_FINALI);
    // tpSetVal(`PS2_CODBAN${nInputDinamico}`  , el.PS2_CODBAN);
    tpSetVal(`PS2_AGENC${nInputDinamico}`   , el.PS2_AGENC);
    tpSetVal(`PS2_CONTCC${nInputDinamico}`  , el.PS2_CONTCC);
    tpSetVal(`PS2_CGCTI${nInputDinamico}`   , el.PS2_CGCTI);
    tpSetVal(`PS2_NOMETI${nInputDinamico}`  , el.PS2_NOMETI);
    tpSetVal(`PS2_BOLJUR${nInputDinamico}`  , el.PS2_BOLJUR);
    tpSetVal(`PS2_BOLMUL${nInputDinamico}`  , el.PS2_BOLMUL);	 					   
    tpSetVal(`PS2_BANDES${nInputDinamico}`  , el.PS2_BANDES);	 					   
}

function scmFichaPrePedido_preparaParcelas(PS2_PARCE){
    var codif                   = '';
    var manip                   = PS2_PARCE.replace("[", "");
    manip                       = manip.replace("]", "")
    manip                       = manip.replaceAll("},{","|").split("|")
    scmFichaPrePedido.dadosPS2  = []
    
    for (var i = 0; i < manip.length; i++){ 
        var linha = manip[i].replace("{",""); 
        linha = linha.replace("}",""); 
        linha = linha.replace("[",""); 
        linha = linha.replace("]",""); 
        linha = "{" + linha +"}"; 
        codif = JSON.parse(linha); 
        scmFichaPrePedido.dadosPS2.push(codif)
    }
}

function scmFichaPrePedido_getCfgFormaPagamento(PS2_CFGPAG){
    var aDataFormPag    = [];
    var formaPagB64     = PS2_CFGPAG;
    formaPagB64 = atob(formaPagB64);
	
	if(!empty(formaPagB64)){
		
		var aData = JSON.parse(formaPagB64);
    
		aData.forEach((el, index) => {
		    var parcela  = el.parcela;
			var data     = el.content;
			var obj      = {};
			
			if(!empty(parcela)){
                aDataFormPag['PS2_FORMPG' + parcela] = data.PS2_FORMPG;
                aDataFormPag['PS2_CODBAR' + parcela] = data.PS2_CODBAR;
                aDataFormPag['PS2_CHVPIX' + parcela] = data.PS2_CHVPIX;
                aDataFormPag['PS2_FINALI' + parcela] = data.PS2_FINALI;
                aDataFormPag['PS2_CODBAN' + parcela] = data.PS2_CODBAN;
                aDataFormPag['PS2_AGENC'  + parcela] = data.PS2_AGENC;
                aDataFormPag['PS2_CONTCC' + parcela] = data.PS2_CONTCC;
                aDataFormPag['PS2_CGCTI'  + parcela] = data.PS2_CGCTI;
                aDataFormPag['PS2_NOMETI' + parcela] = data.PS2_NOMETI;
                aDataFormPag['PS2_BOLJUR' + parcela] = data.PS2_BOLJUR;
                aDataFormPag['PS2_BOLMUL' + parcela] = data.PS2_BOLMUL;
				aDataFormPag['PS2_BANDES' + parcela] = data.PS2_BANDES;								   
			}
			
		});
	}
    
    return aDataFormPag;
}

function scmFichaPrePedido_changeTipoFormaPagamento(inputDinamico, cPS2_FINALI, cPS2_CODBAN){
    var cDisabled      = scmFichaPrePedido.ACAO == 'V' ? 'disabled' : '';
    var formaPagamento  = tpGetVal(`PS2_FORMPG${inputDinamico}`);
    var cHtml           = '';
    
    //Boleto
    if(formaPagamento == "BOL"){
        
        cHtml = `
        
            <div id="divBoleto${inputDinamico}" style="display: none;">
                <div class="col-xs-4 col-md-4" id="divCodigoBarras">
                    <div class="form-group">
                      <label for="PS2_CODBAR${inputDinamico}" class="control-label">Código de Barras</label>
                      <label for="PS2_CODBAR${inputDinamico}" class="error"></label>
                      <input id="PS2_CODBAR${inputDinamico}" class="form-control campo-nota codbar" ${cDisabled}/>
                    </div>
                </div>
                
                <div class="col-xs-4 col-md-3" id="divCodigoBarras" style="display: none;>
                    <div class="form-group">
                      <label for="PS2_BOLJUR${inputDinamico}" class="control-label">% de Juros ao Mês do Boleto</label>
                      <label for="PS2_BOLJUR${inputDinamico}" class="error"></label>
                      <input id="PS2_BOLJUR${inputDinamico}" class="form-control param tp-valor2 campo-nota boljur" ${cDisabled}/>
                    </div>
                </div>
                
                <div class="col-xs-4 col-md-3" id="divCodigoBarras" style="display: none;>
                    <div class="form-group">
                      <label for="PS2_BOLMUL${inputDinamico}" class="control-label">% de Multa por Atraso do Boleto</label>
                      <label for="PS2_BOLMUL${inputDinamico}" class="error"></label>
                      <input id="PS2_BOLMUL${inputDinamico}" class="form-control param tp-valor2 campo-nota bolmul" ${cDisabled}/>
                    </div>
                </div>
                
            </div>
        `; 
    }
    //Pix
    else if(formaPagamento == "PIX"){
        
        cHtml = `
            <div class="col-xs-4 col-md-4" id="divPix${inputDinamico}" style="display:none">
                <div class="form-group">
                    <label for="PS2_CHVPIX${inputDinamico}" class="control-label">Chave Pix (ou QR Code)</label>
                    <label for="PS2_CHVPIX${inputDinamico}" class="error"></label>
                    <input id="PS2_CHVPIX${inputDinamico}" class="form-control campo-nota chvpix" ${cDisabled}/>
                </div>
            </div>
        
        `;
    }
    //Transferencia Bancaria
    else if(formaPagamento == "TRA"){
        
        cHtml = `
            
            <div id="divTransfBancaria${inputDinamico}" style="display: none">
                <div class="col-xs-4 col-md-2" id="divCodigoBarras" style="display: none">
                    <div class="form-group">
                      <label for="PS2_CODBAN${inputDinamico}" class="control-label">Banco</label>
                      <label for="PS2_CODBAN${inputDinamico}" class="error"></label>
                      <input id="PS2_CODBAN${inputDinamico}" class="form-control campo-nota codban" onchange="scmFichaPrePedido_ddlFinalidadeTransferencia('${inputDinamico}')" ${cDisabled}/>
                    </div>
                </div>
                
                <div class="col-xs-4 col-md-3" id="divCodigoBarras" style="display: none">
                    <div class="form-group">
                      <label for="PS2_FINALI${inputDinamico}" class="control-label">Finalidade</label>
                      <label for="PS2_FINALI${inputDinamico}" class="error"></label>
                      <input id="PS2_FINALI${inputDinamico}" class="form-control campo-nota finali" ${cDisabled}/>
                    </div>
                </div>
        
                <div class="col-xs-4 col-md-2" id="divCodigoBarras">
                    <div class="form-group">
                      <label for="PS2_AGENC${inputDinamico}" class="control-label">Agência</label>
                      <label for="PS2_AGENC${inputDinamico}" class="error"></label>
                      <input id="PS2_AGENC${inputDinamico}" class="form-control campo-nota agenc" maxlength="4" ${cDisabled}/>
                    </div>
                </div>

                <div class="col-xs-4 col-md-2" id="divCodigoBarras">
                    <div class="form-group">
                      <label for="PS2_BANDES${inputDinamico}" class="control-label">Banco Desc.</label>
                      <label for="PS2_BANDES${inputDinamico}" class="error"></label>
                      <input id="PS2_BANDES${inputDinamico}" class="form-control campo-nota agenc" maxlength="100" ${cDisabled}/>
                    </div>
                </div>
                
                <div class="col-xs-4 col-md-3" id="divCodigoBarras">
                    <div class="form-group">
                      <label for="PS2_CONTCC${inputDinamico}" class="control-label">Conta Corrente</label>
                      <label for="PS2_CONTCC${inputDinamico}" class="error"></label>
                      <input id="PS2_CONTCC${inputDinamico}" class="form-control campo-nota contcc" placeholder="Exemplo: 01234-1" ${cDisabled}/>
                    </div>
                </div>

                <div class="col-xs-4 col-md-3" id="divCodigoBarras">
                    <div class="form-group">
                      <label for="PS2_CGCTI${inputDinamico}" class="control-label">CNPJ/CPF do Titular</label>
                      <label for="PS2_CGCTI${inputDinamico}" class="error"></label>
                      <input id="PS2_CGCTI${inputDinamico}" class="form-control campo-nota cgcti" onkeypress="scmFichaPrePedido_ajustaMascaraCGC('${inputDinamico}')" ${cDisabled}/>
                    </div>
                </div>
                
                <div class="col-xs-3 col-md-3" id="divCodigoBarras">
                    <div class="form-group">
                      <label for="PS2_NOMETI${inputDinamico}" class="control-label">Nome do Titular</label>
                      <label for="PS2_NOMETI${inputDinamico}" class="error"></label>
                      <input id="PS2_NOMETI${inputDinamico}" class="form-control campo-nota nometi" ${cDisabled}/>
                    </div>
                </div>
            </div>
        `;
    }

    $(`#camposFormaPagamento${inputDinamico}`).html('');
    $(`#camposFormaPagamento${inputDinamico}`).html(cHtml);
    
    
    if(formaPagamento == "BOL"){
        $(`#divBoleto${inputDinamico}`).show(1000);
        
        //Required nos Campos
        $(`#PS2_CODBAR${inputDinamico}`).attr('required', true);
        
    }
    else if(formaPagamento == "PIX"){
        $(`#divPix${inputDinamico}`).show(1000);
        
        //Required nos Campos
        $(`#PS2_CHVPIX${inputDinamico}`).attr('required', true);
        
    }
    else if(formaPagamento == "TRA"){
        
        $(`#divTransfBancaria${inputDinamico}`).show(1000);
        // scmFichaPrePedido_ddlBanco(inputDinamico, cPS2_CODBAN);
        // scmFichaPrePedido_ddlFinalidadeTransferencia(inputDinamico, cPS2_FINALI);

    }
    
    TetrisDefaultMaskAll();
}

function scmFichaPrePedido_ajustaMascaraCGC(inputDinamico){
    tpClearNumber($(`#PS2_CGCTI${inputDinamico}`).val()).length > 11 ? $(`#PS2_CGCTI${inputDinamico}`).mask('00.000.000/0000-00', options) : $(`#PS2_CGCTI${inputDinamico}`).mask('000.000.000-00#', options);
}					

function scmFichaPrePedido_montaConfigFormaPagamento(){

    var aCfgFormaPagamento = [];
	var oCfgFormaPagamento = {};
	var parcelas = $('.valorCondPag').length;
	
	for (var i = 1; i <= parcelas; i++) {
		
		var parcela 	= '0' + i;
		
		var PS2_FORMPG	= tpGetVal(`PS2_FORMPG${parcela}`);			
		var PS2_CODBAR	= tpGetVal(`PS2_CODBAR${parcela}`);
		var PS2_CHVPIX	= tpGetVal(`PS2_CHVPIX${parcela}`);
		var PS2_FINALI	= tpGetVal(`PS2_FINALI${parcela}`);
		var PS2_CODBAN	= tpGetVal(`PS2_CODBAN${parcela}`);
		var PS2_AGENC	= tpGetVal(`PS2_AGENC${parcela}`);
		var PS2_CONTCC	= tpGetVal(`PS2_CONTCC${parcela}`);
		var PS2_CGCTI	= tpGetVal(`PS2_CGCTI${parcela}`);
		var PS2_NOMETI	= tpGetVal(`PS2_NOMETI${parcela}`);
		var PS2_BOLJUR	= tpGetVal(`PS2_BOLJUR${parcela}`);
		var PS2_BOLMUL	= tpGetVal(`PS2_BOLMUL${parcela}`);
	    var PS2_BANDES	= tpGetVal(`PS2_BANDES${parcela}`);
		
		oCfgFormaPagamento = {
		
			"parcela": parcela,
			"content": {
				"PS2_FORMPG": PS2_FORMPG,
				"PS2_CODBAR": PS2_CODBAR,
				"PS2_CHVPIX": PS2_CHVPIX,
				"PS2_CODBAN": PS2_CODBAN,
				"PS2_FINALI": PS2_FINALI,
				"PS2_AGENC"	: PS2_AGENC,
				"PS2_CONTCC": PS2_CONTCC,
				"PS2_CGCTI"	: PS2_CGCTI,
				"PS2_NOMETI": PS2_NOMETI,
				"PS2_BOLJUR": PS2_BOLJUR,
				"PS2_BOLMUL": PS2_BOLMUL,
				"PS2_BANDES": PS2_BANDES
			}
		}
		aCfgFormaPagamento.push(oCfgFormaPagamento);
	}
	
	var cfgFormaPagamento = btoa(JSON.stringify(aCfgFormaPagamento));
	return cfgFormaPagamento;
}

function scmFichaPrePedido_apagaCampoVenc(div) {
    $(tpSelector('#' + div)).remove();
    scmFichaPrePedido_atualizaTotal();
}

function scmFichaPrePedido_pse_doc_change() {
    $(tpSelector('#PS2_NFNUM')).val($(tpSelector('#PS2_NFNUM')).val().padLeft('0',9) );
}

function scmFichaPrePedido_changePS2_FLGCAU(){
    if ( tpGetVal("#PS2_FLGCAU") == "S"){
        tpEnable(tpSelector('#PS2_TPCAU'))
        tpEnable(tpSelector('#PS2_MINCAU'))
    }else{
        tpDisable(tpSelector('#PS2_TPCAU'))
        tpDisable(tpSelector('#PS2_MINCAU'))
    }
}

function scmFichaPrePedido_changePS2_FLGRES(){
    (tpGetVal("#PS2_FLGRES") == "S" ) ? tpEnable(tpSelector('#PS2_INDICE')) : tpDisable(tpSelector('#PS2_INDICE'));
}

function scmFichaPrePedido_changePS2_UNVIGE(){
    (tpGetVal("#PS2_UNVIGE") != "I" ) ? tpEnable(tpSelector('#PS2_VIGE')) : tpDisable(tpSelector('#PS2_VIGE'));
   
}

function scmFichaPrePedido_changeGerarPa(domThis){
    if(domThis.value == 'N'){
        $(tpSelector(`#PS2_FORMPG${domThis.id.slice(-2)} [value=CAI]`)).prop('disabled', false)
    }else{
        if(tpGetVal(`PS2_FORMPG${domThis.id.slice(-2)}`) == 'CAI'){
            tpSetVal(`PS2_FORMPG${domThis.id.slice(-2)}`, '');
        }
        
        $(tpSelector(`#PS2_FORMPG${domThis.id.slice(-2)} [value=CAI]`)).prop('disabled', true)
    }
}

function scmFichaPrePedido_retornaItens( cAlter ){
    var cItensPedido = '';
 
    if(scmFichaPrePedido.aData.length > 0){
        scmFichaPrePedido.aData.map( (data) => {
    	    if (cAlter == 'F' && data.PS2_ITEM == tpGetVal("PS2_ITEM" ) ){
    			cItensPedido += tpGetEmpFil() + ';' + data.PS2_FILIAL + ';' + data.PS2_ITEM + ';' + tpGetVal("ddlProdutos") + ";" + tpGetVal("txtQtde").valor() + ';' + tpGetVal("txtValor").valor() + ';' + (tpGetVal("txtValorDesc").valor() || '0') + ';' + tpGetVal("TES") + '|';
    		}else if (cAlter == 'L' && data.PS2_ITEM == scmFichaPrePedido.itemCalculo.slice(-4)) {
    			var chave = tpConvert.encodeObj(scmFichaPrePedido.itemCalculo)
    			
    			cItensPedido += tpGetEmpFil() + ';' + data.PS2_FILIAL + ';' + scmFichaPrePedido.itemCalculo.trim() + ';' + data.PS2_PRODUT + ";" + tpGetVal('#txtQuant_'+chave).valor() + ';' + tpGetVal('#txtPreco_'+chave).valor() + ';' + data.PS2_VLDESC + ';' + data.PS2_TES + '|';	
    		}else{
    			cItensPedido += tpGetEmpFil() + ';' + data.PS2_FILIAL + ';' + data.PS2_ITEM + ';' + data.PS2_PRODUT + ";" + data.PS2_QUANT + ';' + data.PS2_PRECO + ';' + data.PS2_VLDESC + ';' + data.PS2_TES + '|';	
    		}
        })
    }

    if (cAlter == 'F' && empty(tpGetVal("PS2_ITEM"))){
        cItensPedido += tpGetEmpFil() + ';' + tpGetEmpFil() + ';0000;' + tpGetVal("ddlProdutos") + ";" + tpGetVal("txtQtde").valor() + ';' + tpGetVal("txtValor").valor() + ';' + ( tpGetVal("txtValorDesc").valor() || '0' ) + ';' + tpGetVal("TES") + '|';
    }

    cItensPedido = cItensPedido.slice(0,cItensPedido.length - 1)
    
    return cItensPedido;
}

function scmFichaPrePedido_calculaImpostos( cAlter, callbackFunction, chave ){
    if(existBlock(typeof scmFichaPrePedidoPE_calculaImpostos)){
        scmFichaPrePedidoPE_calculaImpostos(cAlter, callbackFunction, chave);
    }else{
        
        var lCalcula = true;
        if (cAlter == 'F') {
            if (empty( tpGetVal("ddlProdutos") ) ||  empty( tpGetVal("txtQtde") ) || empty( tpGetVal("txtValor") ) ){
                lCalcula = false; //Atualiza a Variavel para não realizar o calculo
            }
        }
        
        if (empty($(tpSelector('#ddlFornecedor')).select2('data'))){
            lCalcula = false;
        }
        
        if( tpGetVal("#PS2_MODALI") == "C" ){
            lCalcula = false;
        }

        if (lCalcula && !empty(getTetrisParams("SCM_CALC_IMPOSTOS"))) {
            Metronic.startPageLoading('Calculando Impostos');
            var cItens = scmFichaPrePedido_retornaItens( cAlter )
            var ddlFornecedor   =   $(tpSelector('#ddlFornecedor')).select2('data');;
        	var PS2_FORNEC      =   ddlFornecedor.id.split('/')[0];			    /* PS2_FORNEC */
        	var PS2_LOJA        =   ddlFornecedor.id.split('/')[1];				/* PS2_LOJA */
        	var PS2_FORDES      =   ddlFornecedor.text.split(' - ')[1];
        
    		if (getTetrisParams("SCM_CALC_IMPOSTOS") == "PROTHEUS") {
                tpParam.ClearParam();
                tpParam.AddParams('CONSULTA'    , 'SCM488');
                tpParam.AddParams('FORNECEDOR'  , PS2_FORNEC);
                tpParam.AddParams('LOJA'        , PS2_LOJA);
                tpParam.AddParams('PRODUTOS'    , cItens);
                tpParam.AddParams('VALFRETE'    , tpGetVal('#txtValorFrete') || '0' );
                tpParam.AddParams('NATUREZA'    , tpGetVal('#txtNatureza'));
    			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
                
                var lOk = tpParam.SendFormPostASync('WSGETCONS', `scmFichaPrePedido_calculaImpostosCallback(oDados, '${cAlter}', '${callbackFunction}')`);
            } else if(getTetrisParams("SCM_CALC_IMPOSTOS") == "GOEVO") {
                // rotina de calculo dos impostos em javascript-wh
                scmCore_calcImpostos(cItens, PS2_FORNEC, PS2_LOJA, tpGetVal('#txtValorFrete') , tpGetVal('#txtNatureza') , `scmFichaPrePedido_calculaImpostosCallback(oDados, '${cAlter}', '${callbackFunction}')`);
            }													  
        }else if (!empty(callbackFunction)){
            eval(callbackFunction)
        }
    }
}

function scmFichaPrePedido_calculaImpostosCallback(oDados, cAlter, callbackFunction){
    if (oDados.errorcode == '00'){
        var aData = ajustaraData(oDados);
        
            //debugger;
        if (aData.length > 0){
            if ( cAlter == 'F' ){ //Editado por Formulario
                aDataAlter = aData.filter( data => data.ITEM.trim() == ( empty( tpGetVal("PS2_ITEM") ) ? '0000' : tpGetVal("PS2_ITEM") ) );
            
                if (aDataAlter.length > 0){
                    //Atualiza Valores Ficha Item
                    tpSetVal("#txtIPI",         parseFloat( aDataAlter[0].IT_ALIIPI   || 0 ) );
                    tpSetVal("#txtValorIPI",    parseFloat( aDataAlter[0].IT_VALIPI   || 0 ) );
                    tpSetVal("#txtValorICMSST", parseFloat( aDataAlter[0].IT_VALSOL   || 0 ) );
                    tpSetVal("#txtValorDifal",  parseFloat( aDataAlter[0].IT_VALCMP   || 0 ) );
                    tpSetVal("#txtBasePIS",     parseFloat( aDataAlter[0].IT_BASEPS2  || 0 ) );
        			tpSetVal("#txtPIS",         parseFloat( aDataAlter[0].IT_ALIQPS2  || 0 ) );
        			tpSetVal("#txtValorPIS",    parseFloat( aDataAlter[0].IT_VALPS2   || 0 ) );
        			tpSetVal("#txtBaseCOF",     parseFloat( aDataAlter[0].IT_BASECF2  || 0 ) );
        			tpSetVal("#txtCOF",         parseFloat( aDataAlter[0].IT_ALIQCF2  || 0 ) );
        			tpSetVal("#txtValorCOF",    parseFloat( aDataAlter[0].IT_VALCF2   || 0 ) );
        			tpSetVal("#txtBaseICMS",    parseFloat( aDataAlter[0].IT_BASEICM  || 0 ) );
        			tpSetVal("#txtICMS",        parseFloat( aDataAlter[0].IT_ALIQICM  || 0 ) );
        			tpSetVal("#txtValorICMS",   parseFloat( aDataAlter[0].IT_VALICM   || 0 ) );
                }
            }else{ //Editado por Linha Grid
                aDataAlter = aData.filter( data => data.ITEM.trim() == scmFichaPrePedido.itemCalculo.trim() );
            
                if (aDataAlter.length > 0){
                    cChave = tpConvert.encodeObj(scmFichaPrePedido.itemCalculo)
                    
                    tpParam.ClearParam();
                    tpParam.AddParams('ACAO'        , 'A');
                    tpParam.AddParams('ALIAS'       , 'PS2');
                    tpParam.AddParams('INDICE'      , '1');
                    tpParam.AddParams('CHAVE'       , scmFichaPrePedido.itemCalculo);
                    tpParam.AddParams('PS2_IPI'     , formatNumber( parseFloat( aDataAlter[0].IT_ALIIPI || 0 ), 2 ).valor());
        			tpParam.AddParams('PS2_VALIPI'  , formatNumber( parseFloat( aDataAlter[0].IT_VALIPI || 0 ), 2 ).valor());
        			tpParam.AddParams('PS2_ICMST'   , formatNumber( parseFloat( aDataAlter[0].IT_VALSOL || 0 ), 2 ).valor());
        			tpParam.AddParams('PS2_ICMDA'   , formatNumber( parseFloat( aDataAlter[0].IT_VALCMP || 0 ), 2 ).valor());
        			tpParam.AddParams('PS2_BASPIS'  , formatNumber( parseFloat( aDataAlter[0].IT_BASEPS2  || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_ALQPIS'  , formatNumber( parseFloat( aDataAlter[0].IT_ALIQPS2  || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_VLPIS'  , formatNumber( parseFloat( aDataAlter[0].IT_VALPS2   || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_BASCOF'  , formatNumber( parseFloat( aDataAlter[0].IT_BASECF2  || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_ALQCOF'  , formatNumber( parseFloat( aDataAlter[0].IT_ALIQCF2  || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_VLCOF'  , formatNumber( parseFloat( aDataAlter[0].IT_VALCF2   || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_BASICM'  , formatNumber( parseFloat( aDataAlter[0].IT_BASEICM  || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_ALQICM'  , formatNumber( parseFloat( aDataAlter[0].IT_ALIQICM  || 0 ), 2 ).valor() );
                    tpParam.AddParams('PS2_VLICMS'  , formatNumber( parseFloat( aDataAlter[0].IT_VALICM   || 0 ), 2 ).valor() );
        			tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
        			
                    tpParam.SendFormPost('TABGENER')
                }
            }
            
            if (getTetrisParams("SCM_CALC_IMPOSTOS") != "GOEVO") {
                //Atualiza Impostos
                tpSetVal("#PS2_PIS"     , formatNumber( parseFloat( aData[0].NF_VALPIS || 0 ), 2) )
                tpSetVal("#PS2_COFINS"  , formatNumber( parseFloat( aData[0].NF_VALCOF || 0 ), 2) )
                tpSetVal("#PS2_CSLL"    , formatNumber( parseFloat( aData[0].NF_VALCSL || 0 ), 2) )
                tpSetVal("#PS2_IR"      , formatNumber( parseFloat( aData[0].NF_VALIRF || 0 ), 2) )
                tpSetVal("#PS2_INSS"    , formatNumber( parseFloat( aData[0].NF_VALINS || 0 ), 2) )
                tpSetVal("#PS2_ISS"     , formatNumber( parseFloat( aData[0].NF_VALISS || 0 ), 2) )
                
        		if( scmFichaPrePedido.habilitaBaseImposto == "S"){
                    tpSetVal("#PS2_BSPIS"   , formatNumber( parseFloat( aData[0].NF_BASEPIS || 0 ), 2) )
                    tpSetVal("#PS2_BSCOFI"  , formatNumber( parseFloat( aData[0].NF_BASECOF || 0 ), 2) )
                    tpSetVal("#PS2_BSCSLL"  , formatNumber( parseFloat( aData[0].NF_BASECSL || 0 ), 2) )
                    tpSetVal("#PS2_BSIRRF"  , formatNumber( parseFloat( aData[0].NF_BASEIRR || 0 ), 2) )
                    tpSetVal("#PS2_BSINSS"  , formatNumber( parseFloat( aData[0].NF_BASEINS || 0 ), 2) )
                    tpSetVal("#PS2_BSISS"   , formatNumber( parseFloat( aData[0].NF_BASEISS || 0 ), 2) )
                }
            }
    		
            scmFichaPrePedido_atualizaTotal();
        }
    }
    
    if (!empty(callbackFunction)){
        eval(callbackFunction)
    }
    
    Metronic.stopPageLoading()
}


function scmFichaPrePedido_habilitaFormAE(){
    var aInputs = [ "txtNumeroItem"     , "txtNumPrePedido"     , "txtEmissao"              , "ddlCondPag", 
                    "ddlMoeda"          , "txtValorSeguro"      , "txtTotalDesconto"        , 
                    "txtObsPre"         , "ddlOP"               , "txtNumeroSolicitacao"    , "ddlSolicitante", 
                    "ddlComprador"      , "ddlGrupoProduto"     , "ddlPrioridade"           , "btnNovoItem",
                    "txtQtde"           , "txtUnidade"          , "txtValor"                , "ddlPrioridadeCab",             
                    "txtValorDesc"      , "hdfCodDestinatario"  , "hdfUltimaMsg"            , "hdfNumeroRegistros",
                    "chkAutoScroll"     , "txtMensagemChat"     , "chatUpload"              , "txtValorDespesa",
                    "PS2_MODALI"        , "PS2_TPCTO"           , "PS2_VIGE"                , "PS2_UNVIGE",
                    "PS2_FLGRES"        , "PS2_INDICE"          , "PS2_FLGCAU"              , "PS2_TPCAU",
                    "PS2_MINCAU"        , "PS2_OBJCTO"          , "PS2_ALTCLA"              , "PS2_PEDTII",
                    "txtNatureza"       , "ddlEntObra"          , "PS2_PIS"                 , "PS2_COFINS", 
                    "PS2_CSLL"          , "PS2_IR"              , "PS2_INSS"                , "PS2_ISS",
                    "txtIPI"            , "txtValorIPI"         , "txtValorICMSST"          , "txtValorDifal",
                    "PS2_DSCCON"
                ];
	    
	for (var i = 0; i < aInputs.length; i++) {
		$(tpSelector("#" + aInputs[i])).attr('disabled', 'disabled');
	}

	try {
		$(tpSelector("#ddlFornecedor")).select2('disable');
		$(tpSelector("#txtNatureza")).select2('disable');
        $(tpSelector("#ddlProdutos")).select2('disable');
        disableSelect(tpSelector('#ddlGrupoAprov'));
	}
	catch (e) { }
	
	tpDisable(tpSelector("ddlPrioridadeCab"))
}

function scmFichaPrePedido_ddlBanco(inputDinamico, cPS2_CODBAN){
    var options = {
        dataB64: true,
        queryID: 'SCMA35',
        evalValue:'data.PTI_ID + " - " + data.PTI_DESC', 
        evalText: 'data.PTI_ID + " - " + data.PTI_DESC',
        aQueryParams: [],
        callback: function () {
            
            if(scmFichaPrePedido.ACAO != 'I'){
                
                var PS2_CODBAN = cPS2_CODBAN.split('-');
                var codBanco   = PS2_CODBAN[0];
                var descBanco  = PS2_CODBAN[1];
                
                tpSetVal(`PS2_CODBAN${inputDinamico}`, codBanco + ' - ' + descBanco, codBanco + ' - ' + descBanco);
            }
        } 
    }

    gv$.form.bindSelectQuery(`#PS2_CODBAN${inputDinamico}`, options);
}

function scmFichaPrePedido_ddlFinalidadeTransferencia(inputDinamico, cPS2_FINALI){
    var bancoSelecionado = tpGetVal(`PS2_CODBAN${inputDinamico}`).split('-')[0].trim();
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'   , 'SCMA36');
    tpParam.AddParams('PIJ_BANCO'  , bancoSelecionado);
    var param = tpCloneArray(aParams);

    var options = {
        dataB64: true,
        queryID: 'SCMA36',
        evalValue:'data.PIJ_CODIGO + " - " + data.PIJ_DESCRI', 
        evalText: 'data.PIJ_CODIGO + " - " + data.PIJ_DESCRI',
        aQueryParams: param,
        callback: function () { 
            
            if(scmFichaPrePedido.ACAO != 'I'){
                
                var PS2_FINALI = cPS2_FINALI.split('-');
                var codFinali  = PS2_FINALI[0];
                var descFinali = PS2_FINALI[1];
                
                tpSetVal(`PS2_FINALI${inputDinamico}`, codFinali + ' - ' + descFinali, codFinali + ' - ' + descFinali);
            }
        } 
    }

    gv$.form.bindSelectQuery(`#PS2_FINALI${inputDinamico}`, options);
}

function scmFichaPrePedido_initDdlEspecie( cChave, cDescricao ) {
    var idSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'    , 'SCM969'); 
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    tpParam.AddParams('PESQUISA'    , '%%');
	
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM969',
        minimumInputLength: 0,
        evalValue: 'data.X5_CHAVE.trim()',
        evalText: `data.X5_CHAVE.trim() + ' - ' + data.X5_DESCRI`,
        aQueryParams: paramConsulta,
        callback: function() {
            if (!empty(cChave)){
                tpSetVal("#PS2_ESPECI", cChave.trim(), cDescricao)
            }
            
            scmFichaPrePedido_changeDdlEspecie()						
        }
    }

    gv$.form.bindSelect2(tpSelector('#PS2_ESPECI'), options);
}

function scmFichaPrePedido_changeDdlEspecie(){
    var cEspecie = tpGetVal("#PS2_ESPECI")
    
    $(tpSelector('#divUfOrig')).hide()
    $(tpSelector('#divMunOrig')).hide()
    $(tpSelector('#divUfDest')).hide()
    $(tpSelector('#divMunDest')).hide()
    $(tpSelector('#divChaveNfe')).hide()
    $(tpSelector('#divtIPOcTE')).hide()
    
    if ( cEspecie.substr(0,2).trim() == 'CT'){
        $(tpSelector('#divUfOrig')).show();
        $(tpSelector('#divMunOrig')).show();
        $(tpSelector('#divUfDest')).show();
        $(tpSelector('#divMunDest')).show();
        $(tpSelector('#divtIPOcTE')).show();
    }else if (cEspecie.trim() == 'SPED'){
        $(tpSelector('#divChaveNfe')).show();
    }
}

function scmFichaPrePedido_ddlMunicipio( cComponent, cComponentUF, cEstado ) {
    var idSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM415'); 
    tpParam.AddParams('CC2_EST',  (cEstado || tpGetVal(cComponentUF) ) )//!empty(idSolicitante.PSH_ID) ? idSolicitante.PSH_ID : 'ALL' );
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM415',
        minimumInputLength: 0,
        evalValue: 'data.CC2_CODMUN.trim()',
        evalText: "data.CC2_CODMUN.trim() + ' - ' + data.CC2_MUN.trim()",
        aQueryParams: paramConsulta,
        multiple: false,
    }
    
    gv$.form.bindSelectQuery(cComponent, options);
}

function scmFichaPrePedido_ddlEstado( cComponent ) {
    var idSolicitante = scmBuscaSolicitante(usuarioLogado.codigoUsuario());
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM414'); 
    tpParam.AddParams('PESQUISA', tpGetVal(cComponent))//!empty(idSolicitante.PSH_ID) ? idSolicitante.PSH_ID : 'ALL' );
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM414',
        minimumInputLength: 0,
        evalValue: 'data.CC2_EST.trim()',
        evalText: "data.CC2_EST.trim()",
        aQueryParams: paramConsulta,
        multiple: false,
    }
    gv$.form.bindSelect2(cComponent, options);

    eval($(tpSelector(cComponent)).attr('tpcallback'));
    
}

function scmFichaPrePedido_onchangeMoeda() {
    if(existBlock(typeof scmFichaPrePedidoPE_onchangeMoeda)){
        scmFichaPrePedidoPE_onchangeMoeda();
    }else{
    
        if(tpGetVal('ddlMoeda').trim() == '1' || tpGetVal('ddlMoeda').trim() == '01') {

			$($(tpSelector('#txtContato')).parent().parent()).removeClass('col-xs-2 col-md-2');
            $($(tpSelector('#txtContato')).parent().parent()).addClass('col-xs-12 col-md-3');
		
            $(tpSelector('#divTaxaMoeda')).hide();
        
        }else{
            $($(tpSelector('#txtContato')).parent().parent()).removeClass('col-xs-12 col-md-3');
            $($(tpSelector('#txtContato')).parent().parent()).addClass('col-xs-2 col-md-2');
            
            scmCore_formatarTaxaMoeda('txMoeda', 'text-right');
            $(tpSelector('#divTaxaMoeda')).show()
       
        }
    }    
}

function scmFichaPrePedido_aplicaMaskValor(){
    $(tpSelector('.VALOR_MASK')).inputmask({'alias': 'decimal', 
                                            'radixPoint': ',',
                                            'groupSeparator': '.',
                                            'digits': getTetrisParams('VALOR_MASK'),
                                            'digitsOptional': false,
                                            'autoGroup': true,
                                            'placeholder': '0'});
}


function scmFichaPrePedido_reprovaAprovar(){
    bootbox.confirm("Confirma Reprovação?<p><input id=\"txtObservacao\" rows=\"3\" type=\"text\" class=\"form-control\" placeholder=\"Inserir observação\"/></p>", function (result) {
        if (result) {
            if($('#txtObservacao').val() != '' ){
                var prePedido = tpGetVal('#txtNumPrePedido')
                var contrato =   tpGetVal('#txtNumContrato')
                scmDesbloqueioMedicao.obsRepovacao = $('#txtObservacao').val()
                
                tpParam.ClearParam();
            	tpParam.AddParams('CONSULTA', 'SCM624');
            	tpParam.AddParams('PS2_NUM', prePedido);
            	tpParam.AddParams('PS2_CONTRA', contrato);

                var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_reprovaAprovarCallback(oDados)'); 
            }
            else{
                bootbox.alert('É necessário observação para reprovação');
            }
        }
    });
}

function scmFichaPrePedido_reprovaAprovarCallback(oDados){
    if ( oDados.errorcode == '00'){
        var aData  =ajustaraData(oDados)
        let tpArrayAdvPL = new TPArrayAdvPL();

        aData.forEach((el, index) => {
        	let oParams = {
                ACAO:     "A",
                ALIAS:    "PS2",
                INDICE:   "1",
                CHAVE :el.PS2_NUM+el.PS2_ITEM,
            };
            
            oParams["PS2_STATUS"]      = '007';
            oParams["PS2_OBSREP"]      =  scmDesbloqueioMedicao.obsRepovacao;
        	
        	tpParam.ClearParam();
            tpParam.AddParams(oParams);
            tpArrayAdvPL.add(aParams);
   
        })
        
        tpParam.ClearParam();
        tpParam.AddParams("FNCLOTE", "U_TABGENER");
        tpParam.AddParams("LOTE", tpArrayAdvPL.toString());
        tpParam.SendFormPostASync("GEUPDLOTE", function (oDados) {
            if (oDados.errorcode == "00") {
                toastr.success("Pré Pedido reprovado com sucesso");
                
                scmDesbloqueioMedicao_createGrid()
                TPnavClose(true)
            }
        });    
    }        
}

function scmFichaPrePedido_aprovar(){
//    scmFichaPrePedido_finalizar()
//    scmDesbloqueioMedicao_createGrid()
// }

    var prePedido = tpGetVal('#txtNumPrePedido')
    var contrato =   tpGetVal('#txtNumContrato')
    
    tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM624');
	tpParam.AddParams('PS2_NUM', prePedido);
	tpParam.AddParams('PS2_CONTRA', contrato);

    var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_aprovarCallback(oDados)'); 
}

function scmFichaPrePedido_aprovarCallback(oDados){
    if ( oDados.errorcode == '00'){
        var aData  =ajustaraData(oDados)
        let tpArrayAdvPL = new TPArrayAdvPL();

        aData.forEach((el, index) => {
        	let oParams = {
                ACAO:     "A",
                ALIAS:    "PS2",
                INDICE:   "1",
                CHAVE :el.PS2_NUM+el.PS2_ITEM,
            };
            
            oParams["PS2_STATUS"]      = '001';
        	
        	tpParam.ClearParam();
            tpParam.AddParams(oParams);
            tpArrayAdvPL.add(aParams);
   
        })
        
        tpParam.ClearParam();
        tpParam.AddParams("FNCLOTE", "U_TABGENER");
        tpParam.AddParams("LOTE", tpArrayAdvPL.toString());
        tpParam.SendFormPostASync("GEUPDLOTE", function (oDados) {
            if (oDados.errorcode == "00") {
                toastr.success(" Aprovado com sucesso");
                
                scmDesbloqueioMedicao_createGrid()
                TPnavClose(true)
            }
        });
    }
}

function scmFichaPrePedido_ddlGrupoAprovacaoCP() {
    var codUserComp = usuarioLogado.codigoUsuario();
    
	$(tpSelector("#PS2_APRCON")).select2({
        placeholder: " ",
        allowClear : true,
        minimumInputLength: 2
	});
	
	tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM271'); 
    tpParam.AddParams('CODUSERCOMP', codUserComp)
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM414',
        minimumInputLength: 2,
        evalValue: 'data.AL_COD.trim()',
        evalText: 'data.AL_COD.trim() + " - " + data.AL_DESC',
        aQueryParams: paramConsulta,
        multiple: false,
        callback: function(){
            eval($(tpSelector("#PS2_APRCON")).attr('tpcallback'));
        }
    }
    
    gv$.form.bindSelect2(tpSelector("#PS2_APRCON"), options);
}

function scmFichaPrePedido_onChangeEnvPed(){
    var cValue = tpGetVal("#PS2_ENVPED")
 
    if ( scmFichaPrePedido.ACAO != 'V' ){
        tpEnable('PS2_COPCOM');
        tpEnable('PS2_COPSOL');
     
        if (cValue == 'N'){
            tpSetVal('PS2_COPCOM', 'N');
            tpSetVal('PS2_COPSOL', 'N');
            tpDisable('PS2_COPCOM');
            tpDisable('PS2_COPSOL');
		}
    }
}

function scmFichaPrePedido_initDdlFormaPagamento(formaPag){
    
    if(formaPag != undefined){
        formaPag = formaPag.replaceAll(";", "','");
    }
    
    //Formas de Pagamento 
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCMA21'); 
    tpParam.AddParams('PTN_ID'  , formaPag || 'ALL'); 
    
    var paramConsulta = tpCloneArray(aParams);
    
    options = {
        
        data64: true,
        queryID: 'SCMA21',
        minimumInputLength: 0,
        evalValue: 'data.PTN_ID.trim()',
        evalText: "data.PTN_ID.trim()+ ' - ' +data.PTN_DESC.trim()",			 
        aQueryParams: paramConsulta,
        multiple: false,
        callback: function(){
            eval($(tpSelector("#ddlFormaPag")).attr('tpcallback'));
        }
    }
    
    gv$.form.bindSelectQuery('#ddlFormaPag', options);
}


function scmFichaPrePedido_initDllAprovadores(){
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM289'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM289',
        minimumInputLength: 0,
        evalValue: 'data.AK_COD.trim()',
        evalText: "data.AK_COD.trim()+ ' - ' +data.AK_NOME.trim()",
        aQueryParams: paramConsulta,
        multiple: false,
        callback: function(){
            eval($(tpSelector("#PS2_APRVCP")).attr('tpcallback'));
        }
    }
    
    gv$.form.bindSelect2('#PS2_APRVCP', options);
}


function scmFichaPrePedido_initDdlNatureza() {
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM443'); 
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM443',
        minimumInputLength: 2,
        evalValue: 'data.ED_CODIGO.trim()',
        evalText: "data.ED_CODIGO.trim() + ' - ' + data.ED_DESCRIC.trim()",
        aQueryParams: paramConsulta,
        multiple: false,
    }
    
    gv$.form.bindSelectQuery('#txtNatureza', options);
}


function scmFichaPrePedido_initDdlContaContabil() {
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM420'); 
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM420',
        minimumInputLength: 2,
        evalValue: 'data.CT1_CONTA.trim()',
        evalText: 'data.CT1_CONTA.trim() + " - " + data.CT1_DESC01.trim()',
        aQueryParams: paramConsulta,
        multiple: false,
    }
    
    gv$.form.bindSelectQuery('#PS2_CONTA', options);
}

function scmFichaPrePedido_initDdlPS2_IDPSN() {
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM301'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM301',
        evalValue: 'data.PSN_ID.trim() + "|" + data.PSN_MSG.trim() + "|" + data.PSN_FORM.trim() + "|" + data.PSN_GRUPO.trim().replaceAll(";", "/")',
        evalText: 'data.PSN_ID + " - " + data.PSN_DESC',
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#PS2_IDPSN', options);
}


function scmFichaPrePedido_initDdlItemContabil() {
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM936'); 
    tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM221',
        minimumInputLength: 2,
        evalValue: 'data.CTD_ITEM.trim()',
        evalText: 'data.CTD_ITEM.trim() + " - " + data.CTD_DESC01.trim()',
        aQueryParams: paramConsulta,
        multiple: false,
    }
    
    gv$.form.bindSelectQuery('#PS2_ITEMCT', options);
}

function scmFichaPrePedido_initDdlClasseValor(solicitanteClvl) {
    var solicitanteCValor = '';
    
    if(solicitanteClvl.trim().length >= 3){
        var aClvl = solicitanteClvl.trim().split(';');
        solicitanteCValor = aClvl.length > 1 ? aClvl.join("','") : aClvl[0];
    }else if(solicitanteClvl.trim().length <= 2 ){
        solicitanteCValor = solicitanteClvl.trim();
    }
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'        , 'SCM937');
    tpParam.AddParams('CTH_CLVL'        , solicitanteCValor ? solicitanteCValor : "ALL");
    tpParam.AddParams('EMPFIL_ADHOC'    , scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    var options = { 
        queryID            : 'SCM937',
        evalValue          : 'data.CTH_CLVL',
        evalText           : 'data.CTH_CLVL + " - " + data.CTH_DESC01',
        minimumInputLength : 2,
        aQueryParams       : paramConsulta
    }
    
    gv$.form.bindSelectQuery('PS2_CLVL', options);
}

function scmFichaPrePedido_initDdlCondPagamento(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM324'); 
    tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM324',
        minimumInputLength: 0,
        evalValue: 'data.E4_CODIGO.trim()',
        evalText: 'data.E4_CODIGO.trim() + " - " + data.E4_DESCRI.trim()',
        aQueryParams: paramConsulta,
        multiple: false,
    }
    
    gv$.form.bindSelectQuery('#ddlCondPag', options);
}

function scmFichaPrePedido_initDdlGrupoProduto(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM363'); 
    tpParam.AddParams('GRUPO', "IN: 'ALL'" )//!empty(idSolicitante.PSH_ID) ? idSolicitante.PSH_ID : 'ALL' );
	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
    
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        data64: true,
        queryID: 'SCM363',
        minimumInputLength: 2,
        evalValue: 'data.BM_GRUPO.trim()',
        evalText: 'data.BM_GRUPO.trim() + " - " + data.BM_DESC.trim()',
        aQueryParams: paramConsulta,
        multiple: false,
    }
    
    gv$.form.bindSelectQuery('#ddlGrupoProduto', options);
}

function scmFichaPrePedido_iniDdlOrcamento(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM138'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM138',
        evalValue: 'data.AK1_CODIGO',
        evalText: 'data.AK1_CODIGO.trim() + " - " +data.AK1_DESCRI.trim()',
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#ddlOrcamento', options);
}

function scmFichaPrePedido_initDdlContratoGCT(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM482'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM482',
        evalValue: 'data.CNL_CODIGO.trim()',
        evalText: 'data.CNL_CODIGO.trim() + " - " +data.CNL_DESCRI.trim()',
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#PS2_TIPPLA', options);
    
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM481'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM481',
        evalValue: 'data.CN1_CODIGO.trim()',
        evalText: 'data.CN1_CODIGO.trim() + " - " +data.CN1_DESCRI.trim()',
        aQueryParams: paramConsulta,
        callback                : function(){
            eval($(tpSelector('#PS2_TPCTO')).attr('tpcallback'));
        },
    }
    
    gv$.form.bindSelect2('#PS2_TPCTO', options);
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM480'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM480',
        evalValue: 'data.CN6_CODIGO.trim()',
        evalText: 'data.CN6_CODIGO.trim() + " - " +data.CN6_DESCRI.trim()',
        aQueryParams: paramConsulta,
         callback                : function(){
            eval($(tpSelector('#PS2_INDICE')).attr('tpcallback'));
        },
    }
    
    gv$.form.bindSelect2('#PS2_INDICE', options);

	scmFichaPrePedido_changeContrato()
}

function scmFichaPrePedido_initDdlTipoEquipamento(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'UTIL03'); 
    tpParam.AddParams('ZT9_TABELA', 'TE'); 
    tpParam.AddParams('ZT9_COD', ''); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'UTIL03',
        evalValue: 'data.ZT9_COD',
        evalText: 'data.ZT9_COD.trim() + " - " +data.ZT9_DESCRI.trim()',
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#ddlTipoEquipamento', options);
}

function scmFichaPrePedido_initDdlTipoFollowUp(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM276'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM276',
        evalValue: 'data.PSP_COD',
        evalText: 'data.PSP_COD.trim() + " - " +data.PSP_DESC.trim()',
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#ddlTipoFollowUp', options);
}

function scmFichaPrePedido_initDdlComex(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM494'); 
    tpParam.AddParams('PIK_ID', 'ALL'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM494',
        evalValue: 'data.PIK_ID',
        evalText: 'data.PIK_ID.trim() + " - " +data.PIK_DESC.trim()',
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#ddlModalTransporte', options);

    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM493'); 
    tpParam.AddParams('DB6_COD', 'ALL'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM493',
        evalValue: 'data.DB6_COD',
        evalText: 'data.DB6_COD.trim()',
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#ddlIncoterms', options);
}


function scmFichaPrePedido_carregaIncoterms(cValue){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM493'); 
    tpParam.AddParams('DB6_COD', 'ALL'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM493',
        evalValue: 'data.DB6_COD',
        evalText: 'data.DB6_DESCR.trim()',
        selectedValue: cValue,
        aQueryParams: paramConsulta,
    }
    
    gv$.form.bindSelect2('#PS2_INCOTE', options);
}

function scmFichaPrePedido_ddlTransportadora(){
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA', 'SCM206'); 
    var paramConsulta = tpCloneArray(aParams);
    
    options ={
        queryID: 'SCM206',
        evalValue: 'data.A4_COD',
        evalText: 'data.A4_COD.trim() + " - " +data.A4_NOME.trim()',
        aQueryParams: paramConsulta,
        selectedValue: scmFichaPrePedido.transportadora ? scmFichaPrePedido.transportadora : '',
    }
    
    gv$.form.bindSelect2('#ddlTransportadora', options);
}


function scmFichaPrePedido_changeContrato(){
    var vincula = tpGetVal('#PS2VINC')
    var inputFor = tpGetVal('#ddlFornecedor')
    
    $('#divPS2_NUMCON').hide()
    
    if(!empty(inputFor)){
        if(vincula =='S'){
            $('#divPS2_NUMCON').show()
            $('#PS2_NUMCON').attr('required', true);
        }else{
            $('#divPS2_NUMCON').hide()
            $('#PS2_NUMCON').removeAttr('required');
            
            if (scmFichaPrePedido.ACAO !== 'V'){
                tpSetVal('#PS2_NUMCON', '')
                scmFichaPrePedido_preencheDadosContrato()
            }
        }
    }else{
        if(vincula =='S'){
          tpSetVal('#PS2VINC',"N")    
          toastr.warning('Escolha um Fornecedor')  
        }
    }
}

function scmFichaPrePedido_changeFornecedor() {
    
    var inputFor = tpGetVal('#ddlFornecedor')

    if(!empty(inputFor)){
        
        var ddlFornecedor = $(tpSelector('#ddlFornecedor')).select2('data');
        var fornecedorLoja = ddlFornecedor.id
        var arrayFornecedor =  fornecedorLoja.split('/',6)
        var codigo = arrayFornecedor[0]
        var A2_LOJA =arrayFornecedor[1]
         
        codigo = !empty(codigo)  ? codigo : "ALL"
        A2_LOJA = !empty(A2_LOJA)  ? A2_LOJA : "ALL"
        
        tpParam.ClearParam();
        tpParam.AddParams('CONSULTA'  , 'SCM677');
        tpParam.AddParams('CNC_CODIGO'  , codigo.trim());
        tpParam.AddParams('CNC_LOJA'  , A2_LOJA.trim());
        tpParam.AddParams('CONTRATO'  , 'ALL');

        var paramConsulta = tpCloneArray(aParams);
        
        options ={
            
            data64: true,
            queryID: 'SCM677',
            minimumInputLength: 2,
            evalValue: "data.CN9_NUMERO.trim() + '-' + data.CN9_REVISA.trim() + '/' + data.CN9_NUMERO+data.CN9_REVISA+data.CNA_NUMERO+data.CNB_PEDTIT",
            evalText: "data.CN9_NUMERO.trim() + ' - ' + data.CN9_REVISA.trim()  + ' - ' + data.FORNEC.trim() + ' (Planilha:' + data.CNA_NUMERO + ')'",
            aQueryParams: paramConsulta,
            multiple: false,
            callback: function(){
                
                eval($(tpSelector('#PS2_NUMCON')).attr('tpcallback'));
                
                if (scmFichaPrePedido.ACAO !== 'V'){
                    scmFichaPrePedido_preencheDadosContrato()
                }
            },
        }
        
        gv$.form.bindSelect2('#PS2_NUMCON', options);

        scmFichaPrePedido_changeContrato();
        
        //SAP B1
        if(scmFichaPrePedido.integraAPISAP == "S"){
            
            //Busca as Formas de Pagamento por Fornecedor
            var aDataForne  = scmFichaPrePedido_getFormaPagamentoFornecedor(inputFor);
            
            var formaPag    = aDataForne.A2_XFRMPAG;
            var moeda       = aDataForne.A2_XMOEDA;
            var valMoeda    = 1;
            
            if(moeda == "USD"){
                valMoeda = 2;
            }
            else if(moeda == "EUR"){
                valMoeda= 4;
            }
            
            scmFichaPrePedido_initDdlFormaPagamento(formaPag);
            tpSetVal('ddlMoeda', valMoeda);
            scmFichaPrePedido_onchangeMoeda();
        }
        
        tpParam.ClearParam();
        tpParam.AddParams('CONSULTA'    , 'SCMA36');
        tpParam.AddParams('A2_COD'      , codigo.trim());
        tpParam.AddParams('A2_LOJA'     , A2_LOJA.trim());
        
        var oDados = tpParam.SendFormPost('WSGETCONS')
        var cIdioma = "PT_BR"
        
        if(oDados.errorcode == '00'){
            var data = ajustaraData(oDados)[0]
            cIdioma  = empty(data.A2_IDIOMA.trim()) || data.A2_IDIOMA.trim() == 'PT_BR' ? 'PT_BR' : data.A2_IDIOMA.trim();
        }
        
        if(cIdioma == "PT_BR"){
            $(tpSelector('#divPS2_INCOTE')).hide()
            $(tpSelector('#divDdlFrete')).show()
        }else{
            $(tpSelector('#divPS2_INCOTE')).show()
            $(tpSelector('#divDdlFrete')).hide()
        }
    }
}

function scmFichaPrePedido_getFormaPagamentoFornecedor(inputFor){

    var aDataForne = {};
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'    , 'SCMA22');
    tpParam.AddParams('FORNECEDOR'  , inputFor);
 
    var oDados = tpParam.SendFormPost('WSGETCONS');
    
    if(oDados.errorcode == "00"){
        
        var aData = tpAllTrim(ajustaraData(oDados));
        aDataForne= aData[0];
        
        // formaPag  = aData[0].A2_XFRMPAG;
    }
    else {
        toastr.error(`${oDados.errorcode} - ${oDados.errormsg}`);
    }
    
    return aDataForne
}


function scmFichaPrePedido_preencheDadosContrato(){
    var cContrato = tpGetVal('#PS2_NUMCON').split('/')[1]
    
    if (!empty(cContrato)){
        tpParam.ClearParam();
        tpParam.AddParams('CONSULTA'  , 'SCM677');
        tpParam.AddParams('CNC_CODIGO', 'ALL');
        tpParam.AddParams('CNC_LOJA'  , 'ALL');
        tpParam.AddParams('CONTRATO'  , cContrato);
        
        var oDados = tpParam.SendFormPost('WSGETCONS')
        
        if (oDados.errorcode == '00'){
            var aData = ajustaraData(oDados)[0]
            var cPS2_NUM   = '';
            var cUnidVigen = (aData.CN9_UNVIGE == "1" ? "D" :
                             (aData.CN9_UNVIGE == "2" ? "M" :
                             (aData.CN9_UNVIGE == "3" ? "A" :
                             (aData.CN9_UNVIGE == "4" ? "I" : "" ) ) ) )
            
            scmFichaPrePedido.tipoPlanilha = aData.CNA_TIPPLA;
            
            tpSetVal("#PS2_DSCCON"  , aData.CN9_DESCRI )
            tpSetVal("#PS2_TPCTO"   , aData.CN9_TPCTO )
            tpSetVal("#PS2_PEDTII"  , (aData.CNB_PEDTIT == '1' || empty(aData.CNB_PEDTIT) ? 'N' : 'T') )
            tpSetVal("#PS2_UNVIGE"  , cUnidVigen )
            tpSetVal("#PS2_VIGE"    , aData.CN9_VIGE )
            tpSetVal("#PS2_FLGRES"  , (aData.CN9_FLGREJ == '1' ? 'S' : 'N') )
            tpSetVal("#PS2_INDICE"  , aData.CN9_INDICE )
            tpSetVal("#PS2_FLGCAU"  , (aData.CN9_FLGCAU == '1' ? 'S' : 'N') )
            tpSetVal("#PS2_TPCAU"   , (aData.CN9_TPCAUC == '1' ? 'M' : 'R') )
            tpSetVal("#PS2_MINCAU"  , aData.CN9_MINCAU )
            tpSetVal("#PS2_OBJCTO"  , aData.CN9_CODOBJ )
            tpSetVal("#PS2_ALTCLA"  , aData.CN9_ALTCLA )
            tpSetVal("#txtNatureza" , aData.CN9_NATURE, aData.CN9_NATURE.trim() + ' - ' + aData.ED_DESCRIC.trim() )
            tpSetVal('#PS2_TIPPLA'  , aData.CNA_TIPPLA )

            scmFichaPrePedido.aData.forEach((data, index) => {
                cPS2_NUM = data.PS2_NUM
                
                tpParam.ClearParam();
                tpParam.AddParams('ACAO'        , 'A');
                tpParam.AddParams('ALIAS'       , 'PS2');
                tpParam.AddParams('INDICE'      , '1');
                tpParam.AddParams('CHAVE'       , data.PS2_NUM + data.PS2_ITEM);
                tpParam.AddParams('PS2_TIPPLA'  , aData.CNA_TIPPLA);
            	tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);
            	
                tpParam.SendFormPostASync('TABGENER');
            })
            
            tpDisable('#PS2_TIPPLA')
            tpDisable("#PS2_DSCCON")
            tpDisable("#PS2_TPCTO")
            tpDisable("#PS2_PEDTII")
            tpDisable("#PS2_UNVIGE")
            tpDisable("#PS2_VIGE")
            tpDisable("#PS2_FLGRES")
            tpDisable("#PS2_INDICE")
            tpDisable("#PS2_FLGCAU")
            tpDisable("#PS2_TPCAU")
            tpDisable("#PS2_MINCAU")
            tpDisable("#PS2_OBJCTO")
            tpDisable("#PS2_ALTCLA")
            tpDisable("#txtNatureza")
            
            scmFichaPrePedido_itens_createGrid(cPS2_NUM)
        }
    }else{
        tpEnable("#PS2_DSCCON")
        tpEnable("#PS2_TPCTO")
        tpEnable("#PS2_PEDTII")
        tpEnable("#PS2_UNVIGE")
        tpEnable("#PS2_VIGE")
        tpEnable("#PS2_FLGRES")
        tpEnable("#PS2_INDICE")
        tpEnable("#PS2_FLGCAU")
        tpEnable("#PS2_TPCAU")
        tpEnable("#PS2_MINCAU")
        tpEnable("#PS2_OBJCTO")
        tpEnable("#PS2_ALTCLA")
        tpEnable("#txtNatureza")
        tpEnable('#PS2_TIPPLA')

        scmFichaPrePedido.tipoPlanilha = ''
    }
}


function scmFichaPrePedido_processaRateioGeralCompleto() {
    var qtdItem	      = parseFloat((tpGetVal('txtQtde') || '0').valor()) 
	var valorItem     = parseFloat((tpGetVal('#txtValor') || '0').valor());
	var ValorTtItem   = qtdItem * valorItem ;
    let rateio_geral  = [];
    
    if(scmFichaPrePedido.dados_rateio_geral) {
        scmFichaPrePedido.dados_rateio_geral.forEach( data => {
            rateio_geral.push({ 
                "PSU_CC"    : data.PSU_CC, 
                "PSU_DCC"   : data.PSU_DCC, 
                "PSU_CONTA" : data.PSU_CONTA, 
                "PSU_DCONTA": data.PSU_DCONTA, 
                "PSU_ITMCTA": data.PSU_ITMCTA, 
                "PSU_DITCTA": data.PSU_DITCTA, 
                "PSU_CLVL"  : data.PSU_CLVL,
                "PSU_DCLVL" : data.PSU_DCLVL,
                "PSU_PERC"  : (data.PSU_PERC/100)          *  100,
                "PSU_QTD"   : (data.PSU_QTD/qtdItem)       * qtdItem,
                "PSU_VALOR" : (data.PSU_VALOR/ValorTtItem) * ValorTtItem,
                "PSU_ENTIDA": "PS2",
                "PSU_ENTCTB": "ALL",
                "PSU_TIPO"  : "N"
            })
        });
    }

    return rateio_geral;
}

function scmFichaPrePedido_ratearGeral() {
    var dados_rateio = null;
    
    if(!empty(scmFichaPrePedido.dados_rateio_geral)) {
        if(!empty(scmFichaPrePedido.dados_rateio_geral[0].PSU_CC) || !empty(scmFichaPrePedido.dados_rateio_geral[0].PSU_CLVL) || !empty(scmFichaPrePedido.dados_rateio_geral[0].PSU_CONTA || !empty(scmFichaPrePedido.dados_rateio_geral[0].PSU_ITMCTA))) {
            var dados_rateio = scmFichaPrePedido.dados_rateio_geral;
        }
    }
    
    TPnavpop('scmRateioGeral.html', `scmRateioGeral_init('', '', 'PS2', '', '','', '${tpConvert.encodeObj(dados_rateio)}', 'scmFichaPrePedido_ratearCallbackGeral( dadosRateioB64 )',  'PP' , '${scmFichaPrePedido.ACAO}' )`, '70%')
}

function scmFichaPrePedido_ratearCallbackGeral( dadosRateioB64 ) {
    scmFichaPrePedido.dados_rateio_geral = tpConvert.decodeObj(dadosRateioB64);
}

function scmFichaPrePedido_getRateioPorEntContabilGeral( codEntidade, itemEntidade ) {
	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM788');
    tpParam.AddParams('ENTIDADE', "PS2");
	tpParam.AddParams('CODENT'  , codEntidade);
	tpParam.AddParams('ITMENT'  , itemEntidade);

	let oDados = tpParam.SendFormPost('WSGETCONS');

	if(oDados.errorcode == '00') {
        let aData = ajustaraData(oDados);

        aData.forEach( data => {
            scmFichaPrePedido.dados_rateio_geral.push({
                "PSU_CC"     : data.PSU_CC,
                "PSU_DCC"    : data.PSU_DCC,
                "PSU_CONTA"  : data.PSU_CONTA,
                "PSU_DCONTA" : data.PSU_DCONTA,
                "PSU_ITMCTA" : data.PSU_ITMCTA,
                "PSU_DITCTA" : data.PSU_DITCTA,
                "PSU_CLVL"   : data.PSU_CLVL,
                "PSU_DCLVL"  : data.PSU_DCLVL,
                "PSU_PERC"   : data.PERC,
                "PSU_VALOR"  : data.PSU_VALOR,
                "PSU_QTD"    : data.PSU_QTD
            })
        })
	}
}

function scmFichaPrePedido_defineGrupoAprovacaoNovoProcesso() {
    var aRegraAprovacaoPC = getTetrisParams("DEFINE_REGRA_GRUPO_APROVACAO_PC", "SCM").split('_');
    var WHERE_CUSTOM      = '';
    
    tpParam.ClearParam();
	tpParam.AddParams('CONSULTA'	 , "SCM177");
	tpParam.AddParams('PESQUISA'     , 'ALL');
	tpParam.AddParams('PI2_ID'       , 'ALL');
	tpParam.AddParams('SELECT_CUSTOM', 'IN: ');
	tpParam.AddParams('JOIN_CUSTOM'  , 'IN: ');
	
    aRegraAprovacaoPC.forEach(cRegraAprPC => {
        switch (cRegraAprPC) {
            case 'LE':
                WHERE_CUSTOM += `AND PI2_PROCES = 'PC' AND PI2_FILENT   = '${tpGetVal("#ddlEntregar")}' `;
            break;
            case 'LF':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_FILFAT   = '${tpGetVal("#ddlEntregar")}' ` ;
            break;
            case 'CC':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_CC       = '${scmFichaPrePedido.aData[0].PS2_CC.trim()}' ` ;
            break;
            case 'IC':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_ITEMCT   = '${tpGetVal("#PS2_ITEMCT")}' ` ;
            break;
            case 'CV':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_CLVL	  = '${scmFichaPrePedido.aData[0].PS2_CLVL.trim()}' ` ;
            break;
            case 'PO':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_CODPLA	  = '${tpGetVal("#ddlPlanOrc")}' ` ;
            break;
            case 'CT':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_CO	      = '${tpGetVal("#ddlContaOrc")}' ` ;
            break;
            case 'GP':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_GP	      = '${tpGetVal("#ddlGrupoProduto")}' ` ;
            break;
            case 'CO':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_COMPRA	  = '${tpGetVal("#ddlComprador")}' ` ;
            break;
            case 'SO':
                WHERE_CUSTOM += ` AND PI2_PROCES = 'PC' AND PI2_SOLICI	  = '${tpGetVal("#ddlSolicitante")}' `;
            break;
            default:
                WHERE_CUSTOM += ` AND 1 = 2 ` ;
        }
            
    })    
    
    tpParam.AddParams('WHERE_CUSTOM'    , `IN: ${WHERE_CUSTOM}` );
    
    var oDados = tpParam.SendFormPost('WSGETCONS');
    var data  = ajustaraData(oDados)[0];
    
    var retornoAprovacao = {};
    if(!empty(data.PI2_GPAPRV.trim())) {
        retornoAprovacao = {aprovacao: "GP", conteudoAprovacao: data.PI2_GPAPRV.trim()};
    } else {
        retornoAprovacao = {aprovacao: "", conteudoAprovacao: ""};
    }
    
    return retornoAprovacao;
}

function scmFichaPrePedido_geraNFAuto(cC7_NUM){
    var dItensPedido = '';
    
    var valIPI      = 0;
    var valICMSST   = 0;
    var valDIFAL    = 0;
    var valDesc     = 0;
    var valDespe    = 0;
    var valSeg      = 0;
    var nTotalLiquido   = 0;
    
    var cPedido = "";
    var cItem = "";
    var cProduto = "";
    var cUM = "";
    var cQtdRec = "";
    var cVlrUni = "";
    var cVlrTot = "";
    var cTes = "";
    var cConta = "";
    var cCC = "";
    var cItemCta = "";
    var cClVl = "";
    var cLocal = "";
    var nIPI = "";
    var nICMSST = "";
    var nICMSDA = "";
    var nBsICMS = "";
    var nAqICMS = "";
    var nVlICMS = "";
    var nBsCOF = "";
    var nAqCOF = "";
    var nVlCOF = "";
    var nBsPIS = "";
    var nAqPIS = "";
    var nVlPIS = "";
    var nVlDesc = "";
    var valDesp = "";
    var valSeguro = "";
    var valFrete = "";
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA',   'SCM471');
    tpParam.AddParams('C7_NUM'  ,   cC7_NUM);

    var oDadosPed = tpParam.SendFormPost('WSGETCONS');
    
    if(oDadosPed.errorcode == "00" && parseInt(oDadosPed.totalreg) > 0){
        
        var aDataPed 	= ajustaraData( oDadosPed );
        scmFichaPrePedido.dataPed = aDataPed;
        
        tpParam.ClearParam();
        tpParam.AddParams("ACAO" , "I");
        tpParam.AddParams("PSE_FORNEC" , aDataPed[0].C7_FORNECE);
        tpParam.AddParams("PSE_LOJA"   , aDataPed[0].C7_LOJA);
        tpParam.AddParams("PSE_XPEDID" , aDataPed[0].C7_NUM);
        tpParam.AddParams("PSE_DOC"    , aDataPed[0].C7_NFNUM);
        tpParam.AddParams("PSE_SERIE"  , aDataPed[0].C7_NFSERI);
        tpParam.AddParams("PSE_EMISSA" , aDataPed[0].C7_NFEMIS);
        tpParam.AddParams("PSE_ANEXOS" , aDataPed[0].C7_NFANEX);
        tpParam.AddParams("PSE_NOTA"   , "");
        tpParam.AddParams("PSE_OBSNOT" , "");
        tpParam.AddParams("PSE_HISTAV" , "");
        tpParam.AddParams("PSE_PIS"    , aDataPed[0].PS2_PIS);
        tpParam.AddParams("PSE_COF"    , aDataPed[0].PS2_COFINS);
        tpParam.AddParams("PSE_CSLL"   , aDataPed[0].PS2_CSLL);
        tpParam.AddParams("PSE_INSS"   , aDataPed[0].PS2_INSS);
        tpParam.AddParams("PSE_IRRF"   , aDataPed[0].PS2_IR);
        tpParam.AddParams("PSE_BSPIS"  , aDataPed[0].PS2_BSPIS);
        tpParam.AddParams("PSE_BSCOFI" , aDataPed[0].PS2_BSCOFI);
        tpParam.AddParams("PSE_BSINSS" , aDataPed[0].PS2_BSINSS);
        tpParam.AddParams("PSE_BSCSLL" , aDataPed[0].PS2_BSCSLL);
        tpParam.AddParams("PSE_BSISS"  , aDataPed[0].PS2_BSISS);
        tpParam.AddParams("PSE_NATUR"  , aDataPed[0].C7_NATUR);
        tpParam.AddParams("PSE_CODSOL" , aDataPed[0].PS2_CODSOL);
        tpParam.AddParams("PSE_FILENT" , aDataPed[0].C7_FILENT);
        tpParam.AddParams("PSE_XLOCFAT", aDataPed[0].C7_XLOCFAT);
        tpParam.AddParams("PSE_ESPECI" , "");
        tpParam.AddParams("PSE_UFORIG" , aDataPed[0].PS2_UFORIG);
        tpParam.AddParams("PSE_MUNORG" , aDataPed[0].PS2_MUNORG);
        tpParam.AddParams("PSE_UFDEST" , aDataPed[0].PS2_UFDEST);
        tpParam.AddParams("PSE_MUNDST" , aDataPed[0].PS2_MUNDST);
        tpParam.AddParams("PSE_CHVNFE" , aDataPed[0].PS2_CHVNFE);
        tpParam.AddParams("PSE_COND"   , aDataPed[0].C7_COND);
        tpParam.AddParams("PSE_TPFRET" , aDataPed[0].C7_TPFRETE);
        tpParam.AddParams("PSE_VALFRE" , aDataPed[0].C7_VALFRE);
        tpParam.AddParams("PSE_TPCTE"  , aDataPed[0].C7_TPCTE);
        tpParam.AddParams("PSE_TXMOED" , aDataPed[0].C7_TXMOED);
        tpParam.AddParams("PSE_MOEDA"  , aDataPed[0].C7_MOEDA);
        tpParam.AddParams("PSE_CFGAVA" , "");
        tpParam.AddParams("PSE_PARC01" , aDataPed[0].PS2_VALOR1);
        tpParam.AddParams("PSE_PARC02" , aDataPed[0].PS2_VALOR2);
        tpParam.AddParams("PSE_PARC03" , aDataPed[0].PS2_VALOR3);
        tpParam.AddParams("PSE_PARC04" , aDataPed[0].PS2_VALOR4);
        tpParam.AddParams("PSE_PARC05" , aDataPed[0].PS2_VALOR5);
        tpParam.AddParams("PSE_PARC06" , aDataPed[0].PS2_VALOR6);
        tpParam.AddParams("PSE_PARC07" , aDataPed[0].PS2_VALOR7);
        tpParam.AddParams("PSE_PARC08" , aDataPed[0].PS2_VALOR8);
        tpParam.AddParams("PSE_PARC09" , aDataPed[0].PS2_VALOR9);
        tpParam.AddParams("PSE_VENC01" , aDataPed[0].PS2_VENC1);
        tpParam.AddParams("PSE_VENC02" , aDataPed[0].PS2_VENC2);
        tpParam.AddParams("PSE_VENC03" , aDataPed[0].PS2_VENC3);
        tpParam.AddParams("PSE_VENC04" , aDataPed[0].PS2_VENC4);
        tpParam.AddParams("PSE_VENC05" , aDataPed[0].PS2_VENC5);
        tpParam.AddParams("PSE_VENC06" , aDataPed[0].PS2_VENC6);
        tpParam.AddParams("PSE_VENC07" , aDataPed[0].PS2_VENC7);
        tpParam.AddParams("PSE_VENC08" , aDataPed[0].PS2_VENC8);
        tpParam.AddParams("PSE_VENC09" , aDataPed[0].PS2_VENC9);
        tpParam.AddParams("USUARIO"    , aDataPed[0].PS2_CODSOL);
        
        var cEMPFIL = aDataPed[0].PS2_CODEMP + aDataPed[0].PS2_CODFIL;
    
        for( let i =0; i < aDataPed.length; i++ ) {
        
            valIPI      += parseFloat(aDataPed[i].C7_VALIPI);
            valICMSST   += parseFloat(aDataPed[i].C7_ICMSRET);
            valDIFAL    += parseFloat(aDataPed[i].C7_ICMCOMP);
            valDesc     += parseFloat(aDataPed[i].C7_VLDESC);
            valDespe    += parseFloat(aDataPed[i].C7_DESPESA);
            valSeg      += parseFloat(aDataPed[i].C7_SEGURO);
            
            cPedido     = aDataPed[i].C7_NUM;
            cItem       = aDataPed[i].C7_ITEM;
            cProduto    = aDataPed[i].C7_PRODUTO;
            cUM         = aDataPed[i].C7_UM;
            cQtdRec     = aDataPed[i].C7_QUANT;
            cVlrUni     = aDataPed[i].C7_PRECO;
            cVlrTot     = aDataPed[i].C7_TOTAL;
            cTes        = aDataPed[i].C7_TES;
            cConta      = aDataPed[i].C7_CONTA;
            cCC         = aDataPed[i].C7_CC;
            cItemCta    = aDataPed[i].C7_ITEMCTA;
            cClVl       = aDataPed[i].C7_CLVL;
            cLocal      = aDataPed[i].C7_LOCAL;
            nIPI        = aDataPed[i].C7_IPI;
            nICMSST     = aDataPed[i].C7_ICMSRET;
            nICMSDA     = aDataPed[i].C7_ICMCOMP;
            nBsICMS     = aDataPed[i].C7_BASEICM;
            nAqICMS     = aDataPed[i].C7_PICM;
            nVlICMS     = aDataPed[i].C7_VALICM;
            nBsCOF      = aDataPed[i].C7_BASCOF;
            nAqCOF      = aDataPed[i].C7_ALQCOF;
            nVlCOF      = aDataPed[i].C7_VALCOF;
            nBsPIS      = aDataPed[i].C7_BASPIS;
            nAqPIS      = aDataPed[i].C7_ALQPIS;
            nVlPIS      = aDataPed[i].C7_VALPIS;
            nVlDesc     = aDataPed[i].C7_VLDESC;
            valDesp     = aDataPed[i].C7_DESPESA;
            valSeguro   = aDataPed[i].C7_SEGURO;
            valFrete    = aDataPed[i].C7_VALFRE;
            
            dItensPedido += cPedido    + '|' + cItem   + '|' + cProduto    + "|" + cUM         + "|" + cQtdRec     + '|' + 
                         cVlrUni    + '|' + cVlrTot + '|' + cTes        + '|' + cConta      + '|' + cCC         + '|' + 
                         cItemCta   + '|' + cClVl   + '|' + cLocal      + '|' + nIPI        + '|' + nICMSST     + '|' + 
                         nICMSDA    + '|' + nBsICMS + '|' + nAqICMS     + '|' + nVlICMS     + '|' + nBsCOF      + '|' + 
                         nAqCOF     + '|' + nVlCOF  + '|' + nBsPIS      + '|' + nAqPIS      + '|' + nVlPIS      + '|' + 
                         nVlDesc    + '|' + valDesp + '|' + valSeguro   + '|' + valFrete    + ';';
        }
        nTotalLiquido += valIPI+ valICMSST + valDIFAL + valSeg + valDespe;
        
        dItensPedido = dItensPedido.slice(0,dItensPedido.length - 1)
        
        tpParam.AddParams("PSE_TOTAL",  nTotalLiquido); // calcular valor com impostos
        tpParam.AddParams("ITENS" ,     dItensPedido);
        tpParam.AddParams("GERA_NF" ,   getTetrisParams("CM_GERA_NOTA_FISCAL"));
        tpParam.AddParams("DOISAPROV" , getTetrisParams("SCM_DOIS_APROVADOR_NF"));
        
        tpParam.SendFormPostASync('UPDPSE', 'scmFichaPrePedido_geraNFAutoCallback(oDados)');
    }
}

function scmFichaPrePedido_geraNFAutoCallback(oDados) {
    
    if (oDados.errorcode == '00') {
        scmFichaPrePedido.PSE_ID = oDados.content;
    
        // if(getTetrisParams('SCM_HABILITA_TES_NOTA_FISCAL') == 'S' && getTetrisParams('SCM_MOVIMENTA_ESTOQUE_NF') == 'S'){
        //     scmFichaNotaFiscal2_movimentaEstoque(oDados);
        // }
        
        if( getTetrisParams('SCM_NF_FINAL_GOEVO') == 'S' ){
            scmFichaPrePedido_atualizaPedidoCompra();
        }
            
        scmFichaNotaFiscal2_gravaSLA(scmFichaPrePedido.PSE_ID)

        toastr.success('Dados gravados com sucesso.');

    } else {
        return toastr.error('Erro:'+oDados.errormsg);
    }
     
}

function scmFichaPrePedido_atualizaPedidoCompra(){
    var aData  = scmFichaPrePedido.dataPed;
    var oDados = {};
    
    aData.forEach((el, index) => {
    	var cPedido = el.C7_NUM;
        var cItem   = el.C7_ITEM;
        var cQtdRec = parseFloat(el.C7_QUANT) + parseFloat( el.C7_QUJE );
    	
    	tpParam.ClearParam();
        tpParam.AddParams('ACAO'    , 'A')
    	tpParam.AddParams('ALIAS'   , 'SC7')
    	tpParam.AddParams('INDICE'  , '1')
    	tpParam.AddParams('CHAVE'   , cPedido + cItem)
    	tpParam.AddParams('C7_QUJE' , cQtdRec)
        
        oDados = tpParam.SendFormPost("TABGENER");
    })
    
    if ( oDados.errorcode == '00'){
        toastr.success("Nota Lançada com Sucesso!");
    }else{
        toastr.warning("Erro ao lançar Nota (Baixa Pedido): "+ oDados.errormsg);
    }
}


function scmFichaPrePedido_exibirFormularioNaDiv(formulario, ACAO = 'I') {
    var params = [
        {id:'PRODUTOS', params:'PESQUISA'    , value: '%%' , Tipo: 'C'}, 
        {id:'PRODUTOS', params:'B1_GRUPO'    , value: `IN: '${tpGetVal('PS2_IDPSN').split('|')[3].trim().replaceAll('/', "','")}'`, Tipo: 'C'},
    ];
    
    if(!empty(tpGetVal('PS2_IDPSN').split('|')[2])) {
        var options = {
            containerId   : '#divItemFormDinamico',
            formularioId  : !empty(formulario) ? formulario : tpGetVal('PS2_IDPSN').split('|')[2].trim(),
            templateFile  : '',
            respostaId    : '',
            showTitle     : false,
            disableForm   : false,
            hideSaveButton: false,
            paramsField   : params || [],
            callbackSave  : function(respostaId, oDados) { },
            callbackRender: function(aCamposResposta) {
                // debugger;
                var cHtml = '';
                cHtml += `<div class="row" id="divBtnIncluir"> `;
                cHtml += `  <div class="col-xs-4 col-md-2 pull-right"> `;
                cHtml += `      <a class="btn btn-primary pull-right" onclick="scmFichaPrePedido_salvarForm('I')"> `;
                cHtml += `          <i class="fa fa-plus"></i>&nbsp;Adicionar Item `;
                cHtml += `      </a> `;
                cHtml += `  </div> `;
                cHtml += `  <div class="col-xs-4 col-md-2 pull-right"> `;
                cHtml += `      <a class="btn btn-danger pull-left" onclick="scmFichaPrePedido_cancelarInclusaoItemForm()"> `;
                cHtml += `          <i class="fa fa-undo"></i>&nbsp;Cancelar Item `;
                cHtml += `      </a> `;
                cHtml += `  </div> `;
                cHtml += `</div> `;
                
                cHtml += `<div class="row" id="divBtnAlterar" style="display: none"> `;
                cHtml += `  <div class="col-xs-4 col-md-2 pull-right"> `;
                cHtml += `      <a class="btn btn-primary pull-right" onclick="scmFichaPrePedido_salvarForm('A')"> `;
                cHtml += `          <i class="fa fa-plus"></i>&nbsp;Atualizar Item `;
                cHtml += `      </a> `;
                cHtml += `  </div> `;
                cHtml += `  <div class="col-xs-4 col-md-2 pull-right"> `;
                cHtml += `      <a class="btn btn-danger pull-right" onclick="scmFichaPrePedido_cancelarInclusaoItemForm()"> `;
                cHtml += `          <i class="fa fa-undo"></i>&nbsp;Cancelar Item `;
                cHtml += `      </a> `;
                cHtml += `  </div> `;
                cHtml += `</div> `;
                
                
                setTimeout(function() {
                    $($(tpSelector('#divItemFormDinamico')).children().children()).append(cHtml);
                    
                    if(ACAO == "A") {
                        $(tpSelector('#divBtnAlterar')).show();
                        $(tpSelector('#divBtnIncluir')).hide();
                        $(tpSelector('#btnNovoItem')).hide();
                    }
                }, 200);
                
                if(existBlock(typeof scmFichaPrePedidoPE_exibirFormularioNaDiv)){
                    scmFichaPrePedidoPE_exibirFormularioNaDiv(formulario, ACAO);
                }
            },
        };
        
        tpXtpml.renderTemplate(options);
    }else{
        toastr.warning("Modalidade não tem formulário vinculado.");
    }
}

function scmFichaPrePedido_cancelarInclusaoItemForm(){
    scmFichaPrePedido_animateCloseDivItemForm();
    
	$(tpSelector('#btnNovoItem')).show();
	
	
	
// 	$(tpSelector('#btnAdicionarItem')).hide();
// 	$(tpSelector('#btnsEdicao')).hide();
	
// 	scmFichaPrePedido_limpaCampos();
}

function scmFichaPrePedido_animateCloseDivItemForm() {
    if($(tpSelector('#divItemFormDinamico')).css('display') == 'block'){
        $(tpSelector('#divItemFormDinamico')).animate({
            display: "none",
            height: "toggle"
		}, 500);
    }else{
        $(tpSelector('#divItemFormDinamico')).animate({
            display: "block",
            height: "toggle"
		}, 500);
    }
}

function scmFichaPrePedido_alterarItemForm(data) {
    var dataItem = data;
    var dados    = JSON.parse(dataItem.PS2_RESPF);
    
    setTimeout(function(){
        scmFichaPrePedido_exibirFormularioNaDiv(tpGetVal('PS2_IDPSN').split('|')[2].trim(), "A");
        
        setTimeout(function(){
            scmFichaPrePedido_animateCloseDivItemForm();
            
            $('#divItemFormDinamico').children().filter(function() {
                return $(this).find('.page-title').html(`<div align="left" class="page-title" style="margin: 0;font-size: 25px;">Item: <span id="spanItemPP">${dataItem.PS2_ITEM}</span></div>`);
            }).first();
            
            
            var oDados = getDefault_oDados('00', 'testes', JSON.parse(dataItem.PS2_RESPF) );
            var aData  = ajustaraData(oDados);
            
            dados.forEach(data => {
                tpSetVal(data.campo, data.valor);
                
                if(data.referencia.trim() == "SB1") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
                
                if(data.referencia.trim() == "CTT") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
                
                if(data.referencia.trim() == "CTH") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
                
                if(data.referencia.trim() == "PS4") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
                
                if(data.referencia.trim() == "PS4_FAT") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
                
                if(data.referencia.trim() == "CTD") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
                
                if(data.referencia.trim() == "SE4") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
                
                if(data.referencia.trim() == "NNR") {
                    tpSetVal(data.campo, data.valor, data.descritivo.trim());
                }
            });
            
        }, 200);
    }, 100);
}

function scmFichaPrePedido_salvarForm(ACAO) {
    if( !empty(tpGetVal('ddlFornecedor')) ) {
        // if(scmFichaPrePedido_validFormDinamico()) {
            tpLoaderShow();
                
            var dados = scmFichaPrePedido_formataJson(tpGetVal('PS2_IDPSN').split('|')[2].trim());
            var cChave = tpConvert.encodeObj(tpGetVal("#txtNumPrePedido")+$('#spanItemPP').text());
            console.log(JSON.stringify(dados, null, 2));
                
            tpParam.ClearParam();
            tpParam.AddParams('ACAO'      , ACAO );
            tpParam.AddParams('PS2_NUM'   , tpGetVal("#txtNumPrePedido") );
            tpParam.AddParams('PS2_ITEM'  , $('#spanItemPP').text() );
            // tpParam.AddParams('PS2_ITEM'  , tpGetVal('txtNumeroItem') );
            tpParam.AddParams('PS2_FORNEC', $(tpSelector('#ddlFornecedor')).val().split('/')[0] );
            tpParam.AddParams('PS2_LOJA'  , $(tpSelector('#ddlFornecedor')).val().split('/')[1] );
            tpParam.AddParams('PS2_RESPF' , JSON.stringify(dados, null, 2) );
            tpParam.AddParams('PS2_IDPSN' , tpGetVal('#PS2_IDPSN').split("|")[0] );
            tpParam.AddParams('PS2_EMIPED', !empty(tpGetVal("#txtEmissao")) ? tpGetVal("#txtEmissao") : hoje());
            tpParam.AddParams('PS2_TIPOPC', $(tpSelector("#txtTipoPedido")).val());
            tpParam.AddParams('PS2_CODSOL', $(tpSelector("#ddlSolicitante")).val());
            tpParam.AddParams('PS2_CODCOM', $(tpSelector("#ddlComprador")).val());
            tpParam.AddParams('PS2_MOEDA' , $(tpSelector("#ddlMoeda")).val());
            tpParam.AddParams('PS2_EMAIL' , $(tpSelector("#txtEmail")).val());
            tpParam.AddParams('PS2_ENVPED', tpGetVal('#PS2_ENVPED'));
            tpParam.AddParams('PS2_COPCOM', tpGetVal('#PS2_COPCOM'));
            tpParam.AddParams('PS2_COPSOL', tpGetVal('#PS2_COPSOL'));
            tpParam.AddParams('PS2_VLFRET', tpGetVal("#txtValorFrete"));
			tpParam.AddParams('PS2_VLSEGU', tpGetVal("#txtValorSeguro"));
			tpParam.AddParams('PS2_DESPES', tpGetVal("#txtValorDespesa"));
			tpParam.AddParams('PS2_TPFRET', $(tpSelector("#ddlFrete")).val());
			tpParam.AddParams('PS2_TRANSP', tpGetVal('#ddlTransportadora'));
			tpParam.AddParams('PS2_OBSPGT', $(tpSelector("#txtObsPagto")).val());
			tpParam.AddParams('PS2_JUSTIF', $(tpSelector("#PS2_JUSTIF")).val());
			tpParam.AddParams('PS2_COND'  , tpGetVal('#ddlCondPag'));
			tpParam.AddParams('PS2_NFNUM' , tpGetVal('#PS2_NFNUM'));
			tpParam.AddParams('PS2_NFSERI', tpGetVal('#PS2_NFSERI'));
			tpParam.AddParams('PS2_IDPSM' , tpGetVal('#PS2_IDPSM'));
			tpParam.AddParams('PS2_NFEMIS', tpGetVal('#PS2_NFEMIS'));
			tpParam.AddParams('PS2_NFVENC', tpGetVal('#PS2_NFVENC'));
			tpParam.AddParams('PS2_NFANEX', tpGetVal('#PS2_NFANEX'));
			tpParam.AddParams('PS2_ESPECI', tpGetVal('#PS2_ESPECI'));
			tpParam.AddParams('PS2_CHVNFE', tpGetVal('#PS2_CHVNFE'));
			
			scmFichaPrePedido.nSalvarDinamico = $(tpSelector('.valorCondPag')).length;
    
            var idInputDinamicoVenc     = 0;
            var idInputDinamicoParc     = 0;
            var nInputDinamicoValor     = 0;
            var parcelas                = [];
            var idInputDinamicoGerPa    = "";
            var idInputDinamicoAnexoPa  = "";
            if(scmFichaPrePedido.defineModeloCondPag == 'S'){
                // Esse tratamento de somente 9 parcelas precisa ser descontinuado, porem tem vinculo com a integração usando esse formato.
                for (var J = 0; J < 9; J++) {
                    if ( J < scmFichaPrePedido.nSalvarDinamico ) {
                        idInputDinamicoVenc = $(tpSelector('.venc'))[J].id; 
                        idInputDinamicoParc = $(tpSelector('.nValorParc'))[J].id; 
                        
                        tpParam.AddParams(`PS2_VALOR${J + 1}` , parseFloat(tpGetVal('#' + idInputDinamicoParc)));
                        tpParam.AddParams(`PS2_VENC${J + 1}` , tpGetVal('#' + idInputDinamicoVenc) );
                        
                        parcelas.push({
                           VALOR: parseFloat(tpGetVal('#' + idInputDinamicoParc)),
                           VENC: tpGetVal('#' + idInputDinamicoVenc)
                        });
                    } else {
                        tpParam.AddParams(`PS2_VALOR${J + 1}` , 0);
                        tpParam.AddParams(`PS2_VENC${J + 1}` , '');
                    }
                
                }
            } else{    
                for (var J = 0; J < scmFichaPrePedido.nSalvarDinamico; J++) {
                    idInputDinamicoVenc     = $('.venc')[J].id; 
                    idInputDinamicoParc     = $('.nValorParc')[J].id; 
                    
                    parcelas.push({
                        VALOR:  parseFloat(tpGetVal('#' + idInputDinamicoParc)),
                        VENC:   tpGetVal('#' + idInputDinamicoVenc),
                    });
                    
                    if(scmFichaPrePedido.habilitaGerarPa == 'S' && scmFichaPrePedido.defineModeloCondPag == 'C'){
                        idInputDinamicoGerPa    = $('.pa')[J].id; 
                        idInputDinamicoAnexoPa  = $('.anexopa')[J].id; 
                        parcelas[J].GERAPA      = tpGetVal('#' + idInputDinamicoGerPa)
                        parcelas[J].ANEXO       = tpGetVal('#' + idInputDinamicoAnexoPa).replaceAll('|', ';')
                    }
                }
                
                //FORMA DE PAGAMENTO PARCELA
                var oCfgFormaPagamento = scmFichaPrePedido_montaConfigFormaPagamento();
                tpParam.AddParams('PS2_CFGPAG', oCfgFormaPagamento);
		    }    
                
            tpParam.AddParams('PS2_PARCE' , parcelas.length > 0 ? JSON.stringify(parcelas) : '');
   
            if(!empty(tpGetVal("#txtContato"))) {
			    tpParam.AddParams('PS2_CONTAT', tpGetVal("#txtContato"));
			    tpParam.AddParams('PS2_CODCON', '');
			} else if(!empty(tpGetVal("#ddlContato")) && scmFichaPrePedido.habilitaContatoFornecedor == "S") {
			    tpParam.AddParams('PS2_CONTAT', $("#ddlContato option:selected").text().split("-")[1].trim());
			    tpParam.AddParams('PS2_CODCON', tpGetVal("#ddlContato"));
			}
            
            dados.forEach(data => { 
                if(data.referencia.includes('SB1')) {
                    tpParam.AddParams('PS2_PRODUT', data.valor);
			        tpParam.AddParams('PS2_DESC'  , tpGetVal(data.campo, 'text').split('-')[1].trim());
                }
                    
                if(data.referencia.includes('CTH') ) {
                    tpParam.AddParams('PS2_CLVL', data.valor);
                }
                    
                if(data.referencia.includes('QUANT')) {
                    if($('#divItemFormDinamico').is(':visible')){
                        tpParam.AddParams('PS2_QUANT' , data.valor);
                    }else{ 
                        tpParam.AddParams('PS2_QUANT' , tpGetVal(`txtQuant_${cChave}`).valor());
                    }    
                    if(ACAO == 'I') {
                        tpParam.AddParams('PS2_QNTORI', data.valor);
                    }
                }
                
                // else{
                //     if(ACAO == 'A') {
                //         tpParam.AddParams('PS2_QUANT' , data.valor);
                //         // tpParam.AddParams('PS2_QUANT' , tpGetVal(`txtQuant_${cChave}`).valor());
                //     }
                // }
                    
                if(data.referencia.includes('VALOR')) {
                    if($('#divItemFormDinamico').is(':visible')){
                        tpParam.AddParams('PS2_PRECO' , data.valor);
                        
                    }else{   
                        tpParam.AddParams('PS2_PRECO' , tpGetVal(`txtPreco_${cChave}`).valor())
                    }    
                }
                
                // else{
                //     if(ACAO == 'A') {
                //         tpParam.AddParams('PS2_PRECO' , data.valor);
                //         // tpParam.AddParams('PS2_PRECO' , tpGetVal(`txtPreco_${cChave}`).valor());
                //     }
                // }
                    
                if(data.referencia.includes('DTENTREGA') || data.campo.includes('DTENTREGA')) {
                    tpParam.AddParams('PS2_DTENTR', data.valor);
                }
                    
                if(data.campo.includes('ANEXOS')) {
                    tpParam.AddParams('PS2_ANEXOS', data.valor);
                }
                    
                if(data.referencia.includes('OBS')) {
                    tpParam.AddParams('PS2_OBS', data.valor);
                }
                    
                if(data.referencia.includes('CTT')) {
                    tpParam.AddParams('PS2_CC', data.valor);
                }
                    
                if(data.referencia.trim() == 'PS4') {
                    tpParam.AddParams('PS2_FILENT', data.valor);
                }else{
                    tpParam.AddParams('PS2_FILENT', '01');
                }
                
                if(data.referencia.trim() == 'PS4_FAT') {
                    tpParam.AddParams('PS2_LOCFAT', data.valor);
                }
                
                if(data.referencia.trim() == 'CTD') {
                    tpParam.AddParams('PS2_ITEMCT', data.valor);
                }
                    
                if(data.referencia.includes('SA2')) {
                    tpParam.AddParams('PS2_FORNEC', data.valor.split('/')[0]);
                }
                    
                if(data.referencia.includes('SA2')) {
                    tpParam.AddParams('PS2_LOJA', data.valor.split('/')[1]);
                }
                
                if(data.referencia.includes('NNR')) {
                    tpParam.AddParams('PS2_LOCAL', data.valor);
                }
                    
                if(existBlock(typeof scmFichaPrePedidoPE_salvarForm)){
                    scmFichaPrePedidoPE_salvarForm(ACAO);
                }
                
            });
            
            let lOk = tpParam.SendFormPostASync('UPDPS2', `scmFichaPrePedido_salvarFormCallback(data, '${ACAO}')`);
        // }
    }else{
        toastr.warning('Selecione o Fornecedor.');
    }
} 

function scmFichaPrePedido_salvarFormCallback(oDados, ACAO) {
    if (oDados.errorcode == "00") {
    	$(tpSelector('#btnNovoItem')).show();
    	$(tpSelector('#btnAdicionarItem')).hide();
    	$(tpSelector('#btnsEdicao')).hide();
// 			$(tpSelector('#btnFinalizar')).show();

		if (ACAO == 'I') {
			var PS2_NUM = oDados.content;
			
			if (new RegExp("[0-9]{6}").test(PS2_NUM)) {
			    $(tpSelector("#txtNumPrePedido")).val(PS2_NUM);
				scmFichaPrePedido_itens_createGrid(PS2_NUM);
				// bootbox.alert(decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')));
			
			}
		}
		
		scmFichaPrePedido_animateCloseDivItemForm();
        tpDisable('PS2_IDPSN');
        		
		//ALTERAÇÃO ALI 01/04/2020 -> RATEIO CORREÇÃO(LIMPAR DADOS VARIAVEL GLOBAL)
        scmRateio.dadosRateio                       = null;
        scmFichaPrePedido.dados_rateio_cc           = null;
        scmFichaPrePedido.dados_rateio_conta        = null;
        scmFichaPrePedido.dados_rateio_item_conta   = null;
        scmFichaPrePedido.dados_rateio_classe_valor = null;
        scmFichaPrePedido.dados_rateio_geral        = null;
		
		if (ACAO == 'S') {
		    if(scmFichaPrePedido.gerarPed == 'N'){
		        bootbox.alert(decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')) ? decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')) : "Pre Pedido Alterado com Sucesso");
		    }
		    else if(scmFichaPrePedido.gerarPed == 'S'){
		         //bootbox.alert("Pedido gerado com sucesso");
		    }
		    
		    
		    // ATUALIZA AMARRACAO PRODUTO X FORNECEDOR
        	if (!empty(numPre) && !empty(PS2_FORNEC)){
        	    let saveSA5 = scmFichaPrePedido_salvaProdPTC(numPre);
                if(!saveSA5){
                    $(tpSelector('#btnFinalizarAguarde')).hide();
        	        $(tpSelector('#btnFinalizar')).show();
        	        hideLoader();
        	        return;
        	    }
        	}
		    
			return true
		}
		
		if(ACAO == 'A'){
		    scmFichaPrePedido_itens_createGrid($(tpSelector("#txtNumPrePedido")).val());
			return true;
		}
		
		if(ACAO == 'I'){
		    scmFichaPrePedido_calculaImpostos('F');
		}
	}
	else {
		bootbox.alert(decodeURIComponent(oDados.errormsg.replace(/\n/g, '<br>')));
		return false
	}
}

function scmFichaPrePedido_formataJson(formulario) {
    const dataCampos = {};
    const dados      = tpXtpml.gerarJsonFormulario(
        $($('#divItemFormDinamico').children()).attr('xtpmlid')
    );
    
    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'  , 'SCM663');
    tpParam.AddParams('FORMULARIO', formulario);
    tpParam.AddParams('PERGUNTA'  , 'ALL');

    const oDados = tpParam.SendFormPost('WSGETCONS');
    if (oDados.errorcode != '00') {
        console.error(oDados.errormsg);
        return;
    }

    const aData = ajustaraData(oDados, true);

    aData.forEach(item => {
        if (item.PYB_VAR) {
            dataCampos[item.PYB_VAR.trim()] = item;
        }
    });

    const novosDados = dados.map(item => {
        const campo = item.campo;
        const info = dataCampos[campo.toUpperCase()];
        const cValorDesc = tpGetVal(item.campo, 'text');
        
        return {
            ...item,
            referencia: info ? info.PYB_REFER || '' : '',
            uso: info ? info.PYB_USOINT || '' : '',
            label: info ? info.PYB_TEXTO || '' : '',
            descritivo: cValorDesc ? cValorDesc || '' : '',
        };
    });
    
    return novosDados;
}

function scmFichaPrePedido_limparFormulario() {
    if(existBlock(typeof scmFichaPrePedidoPE_limparFormulario)){
        scmFichaPrePedidoPE_limparFormulario();
    }else{
        document.querySelectorAll('#divItemFormDinamico input[type="text"], #divItemFormDinamico input[type="number"], #divItemFormDinamico input[type="hidden"], #divItemFormDinamico input.datepicker').forEach(input => {
            input.value = '';
            
            tpSetVal(input.id, '', '');
        });
    
        document.querySelectorAll('#divItemFormDinamico select').forEach(select => {
            select.selectedIndex = 0;
            if ($(select).hasClass('select2-offscreen')) {
                $(select).val(null).trigger('change');
            }
        });
        
        $('#divItemFormDinamico').children().filter(function() {
            return $(this).find('.page-title').html(`<div align="left" class="page-title" style="margin: 0;font-size: 25px;"><span id="spanItemPC">Novo Item</span></div>`);
        }).first();
    
        document.querySelectorAll('#divItemFormDinamico textarea').forEach(textarea => {
            textarea.value = '';
        });
    
        const fileList = document.getElementById('fileListANEXOS');
        if (fileList) {
            fileList.innerHTML = '';
        }
    
        const progressBar = document.getElementById('progressANEXOS');
        if (progressBar) {
            progressBar.style.display = 'none';
            progressBar.querySelector('.progress-bar').style.width = '0%';
        }
    }
}

function scmFichaPrePedido_atualizaValoresJSon(cChave) {
    var PrePedidoItem = tpConvert.decodeObj(cChave);
    var cJsonAlterado = '';

    tpParam.ClearParam();
    tpParam.AddParams('CONSULTA'    , 'SCM017');
    tpParam.AddParams('PS2_NUM'     , PrePedidoItem.slice(0,6));
    tpParam.AddParams('PS2_ITEM'    , PrePedidoItem.slice(6));
    tpParam.AddParams('EMPFIL_ADHOC', scmFichaPrePedido.EMPFIL_ADHOC);

    if (scmFichaPrePedido.habilitaRegraTipoSC == "S") {
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: , MEMO(PS2_RESPF) AS PS2_RESPF, PSN_FORM, PSN_GRUPO');
    } else {
        tpParam.AddParams('CAMPOSCUSTOM', 'IN: ');
    }

    var oDados = tpParam.SendFormPost('WSGETCONS');

    if (oDados.errorcode == '00') {
        var aData = ajustaraData(oDados);

        var cValor = tpGetVal(`txtPreco_${cChave}`);
        var cQuant = tpGetVal(`txtQuant_${cChave}`);
        
        if(!empty(aData[0].PS2_RESPF)){
        
            try {
                let aCampos = JSON.parse(aData[0].PS2_RESPF);
    
                aCampos.forEach(campo => {
                    if (campo.campo === 'QUANTIDADE') {
                        campo.valor = cQuant;
                        campo.descritivo = cQuant;
                    }
                    if (campo.campo === 'VALORUNITARIO') {
                        campo.valor = cValor;
                        campo.descritivo = cQuant;
                    }
                });
    
                // Transforma o JSON de volta para string
                cJsonAlterado = JSON.stringify(aCampos);
    
            } catch (e) {
                console.error('Erro ao manipular o JSON:', e);
                toastr.error('Erro ao atualizar o JSON.');
                return;
            }
    
            // Envia os dados atualizados
            tpParam.ClearParam();
            tpParam.AddParams('ALIAS'    , 'PS2');
            tpParam.AddParams('ACAO'     , 'A');
            tpParam.AddParams('INDICE'   , '1');
            tpParam.AddParams('CHAVE'    , PrePedidoItem);
            tpParam.AddParams('PS2_RESPF', cJsonAlterado);
    
            var oDados = tpParam.SendFormPost('TABGENER');
            if (oDados.errorcode == '00') {
                toastr.success('JSON ALTERADO');
            } else {
                toastr.error('Falha ao salvar alterações.');
            }
        }    
    }
}

function scmFichaPrePedido_createGridItensContrato(){
    var oDados = getDefault_oDados('00', 'Ok', scmFichaPrePedido.aData);
    if (oDados.errorcode == "00") { 
            
        var aColums = [ ]

        aColums.push({ "data": "PS2_ITEM",  "title": "Item",                "width": "2%",      "tipoDado" : "C" });
        aColums.push({ "data": null,        "title": "Produto | Serviço",   "width": "15%",     "tipoDado" : "C",     "render":  function (data, type, full, meta) { return scmFichaPrePedido_renderProdutoItemCont(data, type, full, meta); }});
        aColums.push({ "data": null ,       "title": "Recorrência",         "width": "10%",     "tipoDado" : "C",     "render":  function (data, type, full, meta) { return scmFichaPrePedido_renderRecorrencia(data, type, full, meta); }});
        aColums.push({ "data": null ,       "title": "Qtde Recorrência",    "width": "10%",     "tipoDado" : "C",     "render":  function (data, type, full, meta) { return scmFichaPrePedido_renderQtdeRecorrencia(data, type, full, meta); }});
        aColums.push({ "data": null ,       "title": "Dia Prev. Medição ",  "width": "10%",     "tipoDado" : "C",     "render":  function (data, type, full, meta) { return scmFichaPrePedido_renderDiaPrevMed(data, type, full, meta); }});

        scmFichaPrePedido.oGrid = gv$.grid.dataTable('scmFichaPrePedido_itensContrato', oDados, aColums, {lOrdering: true});
        if(!isMobile()){
            $(tpSelector('#divInfoContratoParceria')).css({'font-size': '11px'})
            $(tpSelector('#scmFichaPrePedido_itensContrato td')).css({"padding": "0.5vh"})
        }
        
        TetrisDefaultMaskAll();
        
        scmFichaPrePedido.aData.forEach(data=>{
            tpSetVal(`#PS2_DESDOB_${data.PS2_ITEM}` , data.PS2_DESDOB )
            tpSetVal(`#PS2_QTDDES_${data.PS2_ITEM}` , data.PS2_QTDDES )
            tpSetVal(`#PS2_DIA_${data.PS2_ITEM}`    , data.PS2_DIA )
            
            if(data.PS2_DESDOB == 'M'){
                $(tpSelector(`#PS2_DIA_${data.PS2_ITEM}`)).prop('disabled', false)
            }
        })
    }

} 

function scmFichaPrePedido_renderProdutoItemCont(data, type, full, meta){
    var coluna   = ''

    if (!empty(full.PS2_PRODUT) ) {
        coluna += ' <small>(' + full.PS2_PRODUT + ') </small>';
        
    }
    
    coluna +=  full.PS2_DESC;
    
    return coluna;
}

function scmFichaPrePedido_renderRecorrencia(data, type, full, meta){
    return scmFichaPrePedido_renderComponente(`PS2_DESDOB_${full.PS2_ITEM.trim()}`, 'select', '', '', 'scmFichaPrePedido_mudaDesdobramento(this)');
}

function scmFichaPrePedido_renderQtdeRecorrencia(data, type, full, meta){
    return scmFichaPrePedido_renderComponente(`PS2_QTDDES_${full.PS2_ITEM.trim()}`, 'input', 'text-right tp-valor', '', '');
}

function scmFichaPrePedido_renderDiaPrevMed(data, type, full, meta){
   return scmFichaPrePedido_renderComponente(`PS2_DIA_${full.PS2_ITEM.trim()}`, 'input', 'text-right tp-valor', 'Dia Prev. Medição', ''); 
}

function scmFichaPrePedido_renderComponente(ID, TIPO, CLASS, DESC, ONCHANGE){
    var cHtml       = '';
	var cStyle      = isMobile() ? '' : 'style="font-size: 11px;margin: 0.3vh;padding: 0.3vh;height: 3vh;"';
	var cDisabled   = scmFichaPrePedido.ACAO == 'V' ? 'disabled' : '';
    
    cHtml = `  
            ${TIPO == 'select' 
                ? `<select id="${ID}" class="form-control recorrencia ${CLASS}" ${cStyle} onchange="${ONCHANGE}" ${cDisabled}>
                        <option value="N" selected>Não</option>
                        <option value="M">Mensal</option>
                    </select>`
                : `<input id="${ID}" class="form-control ${CLASS}" ${cStyle} disabled>`
            } `;
                
    return cHtml            
} 

function scmFichaPrePedido_mudaDesdobramento(domThis, cId = ''){
    var ID = empty(cId) ? domThis.id.split('_')[2] : cId;

    if ( $(`#PS2_DESDOB_${ID}`).val() == 'M' ) {

        $(`#PS2_DIA_${ID}`).attr("disabled",false)

        var inicio  = moment($(`#PS2_VIGINI`).val().CTOS().substr(0,4)+'-'+$(`#PS2_VIGINI`).val().CTOS().substr(4,2)+'-'+$(`#PS2_VIGINI`).val().CTOS().substr(6,2));
        var agora   = moment($(`#PS2_VIGFIM`).val().CTOS().substr(0,4)+'-'+$(`#PS2_VIGFIM`).val().CTOS().substr(4,2)+'-'+$(`#PS2_VIGFIM`).val().CTOS().substr(6,2));

        var diferenca = moment.duration({
            years: agora.year() - inicio.year(),
            months: agora.month() - inicio.month(),
            days: agora.date() - inicio.date()
        });
        
        if ( !empty($(`#PS2_VIGINI`).val()) && !empty($(`#PS2_VIGFIM`).val()) ){
            $(`#PS2_QTDDES_${ID}`).val(diferenca._months+1);
            $(`#PS2_DIA_${ID}`).attr("disabled", false);
            $(tpSelector(`#PS2_DIA_${ID}`)).attr('required', true);
        } else {
            $(`#PS2_DESDOB_${ID}`).val('N');
            toastr.warning('Vigência (Inicial / Final) não preenchida.');
            $(tpSelector(`#PS2_DIA_${ID}`)).attr('required', false);
            $(`#PS2_DIA_${ID}`).attr("disabled", true);
        }
        
    }
    else {
        $(`#PS2_DIA_${ID}`).attr("disabled",true);
        $(`#PS2_QTDDES_${ID}`).val('');
        $(tpSelector(`#PS2_DIA_${ID}`)).attr('required', false);
    }
}

function scmFichaPrePedido_changeRecorrencia(){
    if(!empty(tpGetVal('#PS0_VIGINI')) && !empty(tpGetVal('#PS0_VIGFIM'))){
         Array.from($(tpSelector('.recorrencia'))).forEach(data =>{
            scmFichaPrePedido_mudaDesdobramento('', data.id.split('_')[2])
        })
    }
}

function scmFichaPrePedido_validaRegraDeAprovacaoCc(codPre){
    var aData = '';
    var geraPedido =true;
    
  	tpParam.ClearParam();
	tpParam.AddParams('CONSULTA', 'SCM017');
	tpParam.AddParams('PS2_NUM', codPre);
	tpParam.AddParams('PS2_ITEM', 'ALL'); 
	tpParam.AddParams('CAMPOSCUSTOM', 'IN: ');
	
	var oDados = tpParam.SendFormPost('WSGETCONS')
	
	if (oDados.errorcode == "00") {
		aData = ajustaraData(oDados);
		if (aData.length > 1) {
            // pega o valor do primeiro item
            var primeiroCC = aData[0].PS2_CC.trim();
            // verifica se algum outro item é diferente
            var diferentes = aData.some(item => item.PS2_CC.trim() !== primeiroCC);
            if (diferentes) {
                geraPedido = false;
                hideLoader();
                $(tpSelector('#btnFinalizar')).show();
                $(tpSelector('#btnFinalizarAguarde')).hide();
                bootbox.alert('Os centros de custos  não podem ser  diferentes entre os itens!')
            }
        }
	}
	
	return geraPedido
}
function scmFichaPrePedido_verificarPercContrato(PS0_NUM){
    var data = scmFichaPrePedido.aData;
    
    if(!empty(data[0].PS2_CONTRA) ){
        tpParam.ClearParam();
    	tpParam.AddParams('CONSULTA'    , 'SCM264');
    	tpParam.AddParams('PSL_FORNEC'  , 'ALL');
    	tpParam.AddParams('PSL_PRODUT'  , 'ALL');
    	tpParam.AddParams('PSL_STATUS'  , 'ALL');
    	tpParam.AddParams('PSL_XGESTO'  , 'ALL');
    	tpParam.AddParams('PSL_FILENT'  , 'ALL');
    	tpParam.AddParams('PSL_CONTRA'  , data[0].PS2_CONTRA );
    	tpParam.AddParams('PSL_NUM'     , 'ALL' );
    	tpParam.AddParams('PSL_CLASSI'  , 'ALL' );
    	tpParam.AddParams('PSL_CC'      , 'ALL' );
        tpParam.AddParams('PSL_CODCOM'  , 'ALL');
        tpParam.AddParams('CAMPOSCUSTOM', 'IN:');
        tpParam.AddParams('WHERECUSTOM' , 'IN:');
        tpParam.AddParams('GROUPCUSTOM' , 'IN:');
    	
    	var lOk = tpParam.SendFormPostASync('WSGETCONS', 'scmFichaPrePedido_verificarPercContratoCallback(data)');
    }
    
}

function scmFichaPrePedido_verificarPercContratoCallback(oDados){
    if (oDados.errorcode == '00') {
        var data = ajustaraData(oDados)
        if(scmFichaPrePedido_verificarPercContratoCalc(data[0])){
            scmFichaPrePedido_enviarEmailAvisoContrato(data[0].PSL_NUM,data[0].PSL_CONTRA)
        }
    } else {
        return toastr.error('Erro:'+oDados.errormsg);
    }    
}

function scmFichaPrePedido_verificarPercContratoCalc(data){
    var nTotalContrato   = parseFloat(data.TOTAL);
    var nTotalSolicitado = parseFloat(data.VLRMEDIDO);
    var valorPercentual  = 0;
    var valorIndefinido  = 0;
    
    valorPercentual = (nTotalSolicitado * 100) / nTotalContrato;
    
    if(valorPercentual < 0){
        valorPercentual = 0;
    }
    
    if(valorPercentual >= data.PSL_AVPERC && data.PSL_AVPERC > 0) {
        return true;
    }else{
        return false;
    }
}

function scmFichaPrePedido_enviarEmailAvisoContrato(PSL_NUM,PSL_CONTRA){
    var aData = "";
    
    tpParam.ClearParam();
	tpParam.AddParams('CONSULTA'    , 'SCMA73');
	tpParam.AddParams('PSL_NUM'     , PSL_NUM);
	tpParam.AddParams('PSL_CONTRA'  , PSL_CONTRA);

    var oDados       = tpParam.SendFormPost('WSGETCONS');
    
    if(oDados.errorcode == '00') {
        aData = ajustaraData(oDados);

        var dest = aData[0].ZT1_EMAIL;
        var cAprovador =  aData[0].ZT1_NOME;
        
        if(!empty(dest)){
    
            dataParams = {
                destinatarios: dest,
                destinatariosCC: "",
                assunto: "Percentual de Contrato Atingido",
                conteudo: encodeURI(scmCore_geraHtmlEmail(PSL_CONTRA,cAprovador,"CTPA"))
            };                            
            envMail(dataParams);
        }    
 
        
    }
}

