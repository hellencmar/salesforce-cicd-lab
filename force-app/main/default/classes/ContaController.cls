public with sharing class ContaController {
    @AuraEnabled(cacheable=true)
    public static List<Account> buscarContas(String termo) {
        if (String.isBlank(termo) || termo.trim().length() < 2) {
            return new List<Account>();
        }

        String filtro = '%' + termo.trim() + '%';
        return [
            SELECT Id, Name, Industry, Phone
            FROM Account
            WHERE Name LIKE :filtro
            WITH USER_MODE
            ORDER BY Name
            LIMIT 20
        ];
    }
}
