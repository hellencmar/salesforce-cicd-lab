@IsTest
private class ContaControllerTest {
  @TestSetup
  static void criarDados() {
    insert new List<Account>{
      new Account(Name = 'Acme Brasil'),
      new Account(Name = 'Acme Portugal'),
      new Account(Name = 'Globex')
    };
  }

  @IsTest
  static void deveEncontrarContasPeloNome() {
    Test.startTest();
    List<Account> contas = ContaController.buscarContas('acme');
    Test.stopTest();

    Assert.areEqual(3, contas.size(), 'Deveria encontrar as duas contas Acme');
    Assert.areEqual(
      'Acme Brasil',
      contas[0].Name,
      'Resultado deveria vir ordenado por nome'
    );
  }

  @IsTest
  static void deveRetornarVazioParaTermoVazioOuCurto() {
    Assert.isTrue(
      ContaController.buscarContas(null).isEmpty(),
      'Termo nulo não deveria buscar'
    );
    Assert.isTrue(
      ContaController.buscarContas('   ').isEmpty(),
      'Termo em branco não deveria buscar'
    );
    Assert.isTrue(
      ContaController.buscarContas('a').isEmpty(),
      'Termo com 1 letra não deveria buscar'
    );
  }

  @IsTest
  static void deveRetornarVazioQuandoNadaCombina() {
    List<Account> contas = ContaController.buscarContas('Inexistente');

    Assert.areEqual(
      0,
      contas.size(),
      'Nenhuma conta deveria combinar com o termo'
    );
  }
}
