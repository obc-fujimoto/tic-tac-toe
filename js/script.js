//buttonタグの本来の挙動を無効化
const gameArea = document.getElementById('game-area');
gameArea.addEventListener('dragover',(event) => {
    event.preventDefault();
});

//盤面の状態を多次元配列で表現
function getBoardState(){
    //配列の生成
    const board = Array.from({length: 3}, () => Array(3).fill(''));
   // const board = [    この配列ができる（多次元配列）
   //     ['','',''],
   //     ['','',''],
   //     ['','','']
   // ]
    const cells = document.querySelectorAll('.game-cell');

    cells.forEach(cell => {
        const row = parseInt(cell.getAttribute('data-row'),10);//(cell.getAttribute('data-row')で取得した文字列の数字を正数に変換(これが10の役割)している
        const col = parseInt(cell.getAttribute('data-col'),10);
        const shape = cell.getAttribute('data-shape');
        board[row][col] = shape;
    });

    console.log(board);//確認用

    return board;
}

const listChoice = document.querySelectorAll('li');
const dropCell = document.getElementsByClassName('game-cell');
let dataInfo; //データを格納する

//ドラッグ時の処理
for(let i = 0; i < listChoice.length; i++){  //listChoice.length=2 liタグ持ちが２つのため 多分これ、連続で○(または×)の番にならないようにするやつなんじゃない？
    listChoice[i].addEventListener('dragstart',() => {
        dataInfo = listChoice[i].dataset.shape;
        console.log(dataInfo);
        dropShape(); //ドロップ時の処理
    });
}

// ドロップ時の処理
function dropShape() {
    for (let i = 0; i < dropCell.length; i++) {
        dropCell[i].addEventListener('drop', (event) => {
            if (!event.target.getAttribute('data-shape')) {
                event.target.setAttribute('data-shape', currentPlayer); // 現在のプレイヤーで上書き
                handlemove(event.target, currentPlayer); // 盤面チェックと勝ち負け判定
            }
        });
    }
}
//列が揃っているかの判定
function checkWin(board,player){
    //横のチェック
    for(let row = 0; row < 3; row++){
        if(board[row][0] === player && board[row][1] === player && board[row][2] === player){
            return true;
        }
    }
    //縦のチェック
    for(let col = 0; col < 3; col++){
        if(board[0][col] === player && board[1][col] === player && board[2][col] === player){
            return true;
        } 
    }
    //斜めのチェック
    if(board[0][0] === player && board[1][1] === player && board[2][2] === player){
        return true;
    }
    if(board[0][2] === player && board[1][1] === player && board[2][0] === player){
        return true;
    }

    return false;
}
// プレイヤーの名称を取得する関数
function getPlayerName(player) {
    if (player === 'Bear') {
        return 'くま';
    } else if (player === 'Goat') {
        return 'やぎ';
    }
}

let currentPlayer = 'Bear';  // 最初は「くま」（Bear）のターン

// 勝利メッセージを表示する関数
function displayVictoryMessage(player) {
    const playerName = getPlayerName(player); // プレイヤー名を取得
    const messageElement = document.getElementById('victory-message');
    messageElement.textContent = `${playerName}の勝利です！`;
    messageElement.style.display = 'block';
}

// 盤面の状態と勝ち負けの判定の処理
function handlemove(cell, player) {
    cell.setAttribute('data-shape', player);
    const board = getBoardState();
    if (checkWin(board, player)) {
        displayVictoryMessage(player);
    }
    switchPlayer();  // プレイヤーのターンを交代
}

// ターンを交代する関数
function switchPlayer() {
    currentPlayer = (currentPlayer === 'Bear') ? 'Goat' : 'Bear'; // プレイヤーを切り替え
    console.log(`${getPlayerName(currentPlayer)}のターンです`);
}

// 再戦ボタンをクリックした時のリセット処理
function resetGame() {
    // 盤面の状態をリセット
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
        cell.removeAttribute('data-shape');
    });

    // 勝利メッセージを非表示にする
    const messageElement = document.getElementById('victory-message');
    messageElement.style.display = 'none';

    // 最初のプレイヤー（くま）のターンに戻す
    currentPlayer = 'Bear';
    console.log("くまのターンです");
}

// 再戦ボタンのイベントリスナーを追加
document.getElementById('reset-button').addEventListener('click', resetGame);