const storageKey = 'notes-app';
const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    firstColumn: [],
    secondColumn: [],
    thirdColumn: []
};

new Vue({
    el: '#app',
    data: {
        noteTitle: '',
        items: [],
        firstColumn: initialData.firstColumn,
        secondColumn: initialData.secondColumn,
        thirdColumn: initialData.thirdColumn,
        isFirstColumnFixed: false,
        groupName: null,
        inputOne: null,
        inputTwo: null,
        inputThr: null,
        inputFor: null,
        inputFiv: null,
        important: null
    },
    watch: {
        firstColumn: {
            handler() {
                this.saveDataToLocalStorage();
            },
            deep: true
        },
        secondColumn: {
            handler() {
                this.saveDataToLocalStorage();
            },
            deep: true
        },
        thirdColumn: {
            handler() {
                this.saveDataToLocalStorage();
            },
            deep: true
        }
    },
    computed: {
        isDisabled() {
            return function (groupIndex, item) {

                return item.checked || this.isGroupLastItemDisabled[groupIndex] === item;
            };
        },
        isGroupLastItemDisabled() {
            return this.firstColumn.map(group => {
                if (this.secondColumn.length >= 5 && group.items.length > 0) {
                    const lastUncheckedItem = group.items.slice().reverse().find(item => !item.checked);
                    return lastUncheckedItem;
                }

                return null;
            });
        },
    },
    methods: {
        deleteNoteGroup(groupId) {
            this.firstColumn = this.firstColumn.filter(group => group.id !== groupId);
            this.secondColumn = this.secondColumn.filter(group => group.id !== groupId);
            this.thirdColumn = this.thirdColumn.filter(group => group.id !== groupId);
            this.saveDataToLocalStorage();
        },
        updateProgress(card) {
            const checkedCount = card.items.filter(item => item.checked).length;
            const progress = (checkedCount / card.items.length) * 100;
            card.isComplete = progress === 100;
            if (card.isComplete) {
                card.lastChecked = new Date().toLocaleString();
            }
            this.checkMoveCard();
        },
        moveFirstColm() {
            this.firstColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;

                const isMaxSecondColumn = this.secondColumn.length >= 5;

                if (progress >= 50 && !isMaxSecondColumn) {
                    this.secondColumn.push(card);
                    for (i=0;i<((this.secondColumn.length)-1);i++){
                        this.sortedColumns(i,i+1,2);
                    }

                    this.firstColumn.splice(this.firstColumn.indexOf(card), 1);
                    this.moveSecondColm();
                }
            });

        },
        moveSecondColm() {
            this.secondColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
                if (progress === 100) {
                    card.isComplete = true;
                    card.lastChecked = new Date().toLocaleString();
                    this.thirdColumn.push(card);
                    for (i=0;i<((this.thirdColumn.length)-1);i++){
                        this.sortedColumns(i,i+1,3);
                    }
                    this.secondColumn.splice(this.secondColumn.indexOf(card), 1);
                    this.moveFirstColm();
                }
            })
        },
        checkMoveCard() {
            this.moveFirstColm();
            this.moveSecondColm();
            this.sortedColumns();
        },
        createNotes(){
                const inputs = [this.inputOne, this.inputTwo, this.inputThr, this.inputFor, this.inputFiv];
                const validInputs = inputs.filter(input => input !== null && input.trim() !== '');
                const numItems = Math.max(3, Math.min(5, validInputs.length));
    
                if (this.groupName && this.important) {
                    const newGroup = {
                        id: Date.now(),
                        groupName: this.groupName,
                        items: validInputs.slice(0, numItems).map(text => ({ text, checked: false })),
                        important: this.important,
                    }
                    if (this.firstColumn.length < 3) {
                        this.firstColumn.push(newGroup)
                        for (i=0;i<((this.firstColumn.length)-1);i++){
                            this.sortedColumns(i,i+1,1);
                        }

                        this.saveDataToLocalStorage();
                    }
                }
                this.groupName = null,
                this.inputOne = null,
                this.inputTwo = null,
                this.inputThr = null,
                this.inputFor = null,
                this.inputFiv = null,
                this.important = null

                
        },
        deleteAllCardsInColumn(columnIndex) {
            switch (columnIndex) {
                case 1:
                    this.firstColumn = [];
                    break;
                case 2:
                    this.secondColumn = [];
                    break;
                case 3:
                    this.thirdColumn = [];
                    break;
                default:
                    break;
            }
            this.saveDataToLocalStorage();
        },
        sortedColumns(a,b, columnchecker) {
            if (columnchecker==1){
                if (this.firstColumn[a].important > this.firstColumn[b].important){
                    temp = this.firstColumn[a]
                    this.firstColumn[a]=this.firstColumn[b]
                    this.firstColumn[b]=temp
            
                }
            }
            if (columnchecker==2){
                if (this.secondColumn[a].important > this.secondColumn[b].important){
                    temp = this.secondColumn[a]
                    this.secondColumn[a]=this.secondColumn[b]
                    this.secondColumn[b]=temp
            
                }
            }
            if (columnchecker==3){
                if (this.thirdColumn[a].important > this.thirdColumn[b].important){
                    temp = this.thirdColumn[a]
                    this.thirdColumn[a]=this.thirdColumn[b]
                    this.thirdColumn[b]=temp
            
                }
            }
        },
        saveDataToLocalStorage() {
            const data = {
                firstColumn: this.firstColumn,
                secondColumn: this.secondColumn,
                thirdColumn: this.thirdColumn
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
    }
});