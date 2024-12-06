// Modulos externos
const inquirer = require('inquirer');
const chalk = require('chalk');


// modulos internos
const fs = require('fs');

// Função principal
function operation() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'O que você deseja fazer?',
                choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
            },
        ])
        .then((answers) => {
            const action = answers['action'];
            console.log(action);

            if (action === 'Criar Conta') {
                createAccount();
            }
            else if (action === 'Depositar'){
                // fnçao de depoistar
                deposit();
            }
            else if(action == 'Consultar Saldo'){
                // funçao para consultar saldo
                getAccountBalance();
            }
            else if(action === 'Sacar'){
                // funcao para sacar
                withdram()
            }
            else if(action === 'Sair'){
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
                // Para encerrar o programa
                process.exit();
            }
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}

// criar conta
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'));
    buildAccount();
}

function buildAccount() {
    inquirer
        .prompt([
            {
                name: 'accountName',
                message: 'Digite um nome para a sua conta',
            },
        ])
        .then((answers) => {
            const accountName = answers['accountName'];

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts');
            }

            // Verifica se o nome da conta já existe
            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(
                    chalk.bgRed.black('Esta conta já existe, escolha outro nome.')
                );
                buildAccount(); // Reinicia o fluxo
                return;
            }

            // Cria o arquivo da conta
            fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}');
            console.log(chalk.green('Parabéns! Sua conta foi criada!'));
            operation()
        })
        .catch((erro) => {
            console.log('Erro:', erro);
        });
}


// depositar

function deposit() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
    }
  ]).then((answers) => {
    const accountName = answers['accountName']

    // verificar se a conta existe
    // verifica se n existe conta pela funçao
    if(!checkAccount(accountName)){
        // voltar para inserir nome dnv
        return deposit()
    }

    // nova mensgame do prompt
    inquirer.prompt([
        {
            name:'amount',
            message:'Quanto deseja depositar?',
        },
    ]).then((answers) => {


        const amount = answers['amount']
        // funçao para adiconar amount
        addAmount(accountName, amount)
        operation();



    }).catch((erro) => {
        console.log(`Houve um erro: ${erro}`)
    })

  }).catch((erro) => {
    console.log(`Houve um erro: ${erro}`)
  })
}



// funçao para verificar se a conta existe
function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Está conta não existe, tente outro nome!'))
        return false
    }
    return true
}

// funçao para adiconar amount
function addAmount(accountName, amount){
    const account = getAccount(accountName)
    // console.log(account)

    // verifica se tem um amount
    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }


    // parseFloat(amount): Converte o valor depositado (que vem como string do input do usuário) para um número decimal.
    // parseFloat(account.balance): Converte o saldo atual da conta (também armazenado como string no arquivo JSON) para um número decimal.
    // Soma os dois valores: Adiciona o depósito ao saldo atual.
    // Atribui o novo saldo: Atualiza o saldo da conta com o valor da soma.
    account.balance = parseFloat(amount) + parseFloat(account.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        function(erro) {
            console.log('Houve um erro', + erro)
        },
        console.log(chalk.bgGreen.black(`Foi depositado o valor de R$${amount} na sua conta`))
    )

}


// funçao para ler arquivo acounts
function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: 'utf-8',
        // siginifca que vai ler o arquivo
        flag:'r'
    })

    return JSON.parse(accountJSON)
    }


// funçao para consultar saldo
function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answers) => {
        const accountName = answers['accountName']

        // verificar se a conta existe
        if(!checkAccount(accountName)){
            // da uma nova chance para o ususario digitar uma conta existente
            return getAccountBalance()
        }

        // salva os valores nessa variavel que esta lendo o arquivo
        const accountData = getAccount(accountName)

        // exibe a mensagem final da funcao
        console.log(chalk.bgBlue.black(`Olá o saldo da sua conta é R$${accountData.balance}`))

        // Para inicar uma nova operação
        operation();


    }).catch((erro) => {
        console.log(chalk.bgRed.black(`Houve um erro: ${erro}`))
    })
}

// funcao para sacar
function withdram(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answers) => {
        const accountName = answers['accountName']

        // verifica se a conta existe 
        if(!checkAccount(accountName)){
            // usuario tenta de novo
            return withdram();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then((answers) => {

            const amount = answers['amount']

            // funçao para remover saldo
            removeAmount(accountName, amount)
            // volta para a tela de operações
            // operation();

        }).catch((erro) => {
            console.log(chalk.bgRed.black(`Houve um erro : ${erro}`))
        })

    }).catch((erro) => {
        console.log(chalk.bgRed.black(`Houve um erro : ${erro}`))
    })
}


// funçao para remover saldo
function removeAmount(accountName, amount){
    // salvar a conta em uma variavel
    const accountData = getAccount(accountName)

    // verifica se existe o saldo
    if(!amount){
        console.log(chalk.bgRed.black('Houve um erro, tente novamente mais tarde!'))
        return withdram()
        
    }

    // verificar se o saldo é maior que o valor que desejo sacar
    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return withdram();
    }

    // atualizar valor do saldo
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    // salvar valor do saldo
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        ((erro) => {
            console.log(chalk.bgRed.black(`Houve um erro: ${erro}`))
        })
    )

    console.log(chalk.bgGreen.black(`Foi realizado um saque de R$${amount} da sua conta`))

    // voltar para as operações
    operation();
}


// Chamando a função
operation();
