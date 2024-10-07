import { githubUser } from "./githubuser.js"

export class favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }
    
    load() {
        const entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        this.entries = entries
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

        const userExists = this.entries.find(entry => entry.login === username)

        if(userExists) {
            throw new Error('Usuário já cadastrado.')
        }

        const user = await githubUser.search(username)

        if(user.login === undefined) {
            throw new Error('Usuário não encontrado.')
        }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()

    } catch (error) {
        alert(error.message)
    }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry =>
            entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class favoritesView extends favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
        this.hasEmpty()
    }

    hasEmpty() {
        if(this.entries.length === 0) {
            this.createEmptyRow()
        }
    }

    onadd() {
        const addButton = this.root.querySelector('.search-wrapper button')
        
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search-wrapper input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()
       
        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img'). alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }


            this.tbody.append(row)        
        })
    }

    createRow() {
        const tr = document.createElement('tr') //criação feita pela DOM, não é possível criar tr usando variavel normal

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/genssauer.png" alt="Imagem de Genesson Sauer">
                <a href="htpps://github.com/genssauer" target="_blank">
                    <p>Genesson Sauer</p>
                    <span>genssauer</span>
                </a>
            </td>
            <td class="repositories">
                19
            </td>
            <td class="followers">
                15
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `

        return tr 

    }

    createEmptyRow() {
        const tr = document.createElement('tr') //criação feita pela DOM, não é possível criar tr usando variavel normal

        tr.innerHTML = `
            <td colspan="4" class="empty">
                <div>
                <img src="./assets/estrela.svg">
                Nenhum favorito ainda.
                </div>
            </td>
        `
        this.tbody.append(tr)        

    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
        tr.remove()
        })
    }
}