import { Children } from "react";
import { useState } from "react";
import { Square } from './components/Square.jsx'; 
import { TURNS } from "./constants.js";
import { checkWinner, checkEndGame } from "./logic/board.js";
import confetti from "canvas-confetti";
import { WinnerModal } from "./components/WinnerModal.jsx";


function App() {
  // Leo del localStorage dentro del useState, porque si lo pongo fuera se ejecuta en cada render => muy lento y bloqueante
  // Así, SOLO SE EJECUTA 1 VEZ, porque la inicialización sólo se ejecuta 1 vez
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnsFromStorage = window.localStorage.getItem('turn')
    return turnsFromStorage ? JSON.parse(turnsFromStorage) : TURNS.x
  })

  const [winner, setWinner] = useState(null) 

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.x)
    setWinner(null) 
    // Resetar el localStorage
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    // No actualizamos la posicion si ya tiene algo o
    if (board[index] || winner) {
      return; 
    }
    // Actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn 
    setBoard(newBoard)
    // Cambiar el turno
    const newTurn = turn == TURNS.x ? TURNS.o : TURNS.x
    setTurn(newTurn)
    // Guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', JSON.stringify(newTurn))
    // Revisar si hay un ganador 
    const newWinner = checkWinner(newBoard) 
    if (newWinner) {
      confetti()
      setWinner(newWinner) 
    } else if(checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>{square}</Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn == TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turn == TURNS.o}>{TURNS.o}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  ); 
}

export default App
