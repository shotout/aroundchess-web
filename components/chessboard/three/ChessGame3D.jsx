import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

// Simple Chess.js implementation
class Chess {
  constructor() {
    this.board = this.createInitialBoard();
    this.turn = 'white';
    this.moveHistory = [];
    this.selectedSquare = null;
    this.validMoves = [];
  }

  createInitialBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', color: 'black' };
      board[6][i] = { type: 'pawn', color: 'white' };
    }
    
    // Place other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRow[i], color: 'black' };
      board[7][i] = { type: backRow[i], color: 'white' };
    }
    
    return board;
  }

  getPiece(row, col) {
    return this.board[row] && this.board[row][col];
  }

  isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  getValidMoves(row, col) {
    const piece = this.getPiece(row, col);
    if (!piece || piece.color !== this.turn) return [];

    const moves = [];
    
    switch (piece.type) {
      case 'pawn':
        moves.push(...this.getPawnMoves(row, col, piece.color));
        break;
      case 'rook':
        moves.push(...this.getRookMoves(row, col, piece.color));
        break;
      case 'knight':
        moves.push(...this.getKnightMoves(row, col, piece.color));
        break;
      case 'bishop':
        moves.push(...this.getBishopMoves(row, col, piece.color));
        break;
      case 'queen':
        moves.push(...this.getQueenMoves(row, col, piece.color));
        break;
      case 'king':
        moves.push(...this.getKingMoves(row, col, piece.color));
        break;
    }
    
    return moves;
  }

  getPawnMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Move forward
    if (this.isValidSquare(row + direction, col) && !this.getPiece(row + direction, col)) {
      moves.push([row + direction, col]);
      
      // Double move from start
      if (row === startRow && !this.getPiece(row + 2 * direction, col)) {
        moves.push([row + 2 * direction, col]);
      }
    }
    
    // Capture diagonally
    for (const dc of [-1, 1]) {
      if (this.isValidSquare(row + direction, col + dc)) {
        const target = this.getPiece(row + direction, col + dc);
        if (target && target.color !== color) {
          moves.push([row + direction, col + dc]);
        }
      }
    }
    
    return moves;
  }

  getRookMoves(row, col, color) {
    const moves = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (!this.isValidSquare(newRow, newCol)) break;
        
        const piece = this.getPiece(newRow, newCol);
        if (!piece) {
          moves.push([newRow, newCol]);
        } else {
          if (piece.color !== color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    }
    
    return moves;
  }

  getKnightMoves(row, col, color) {
    const moves = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [dr, dc] of knightMoves) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (this.isValidSquare(newRow, newCol)) {
        const piece = this.getPiece(newRow, newCol);
        if (!piece || piece.color !== color) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }

  getBishopMoves(row, col, color) {
    const moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (!this.isValidSquare(newRow, newCol)) break;
        
        const piece = this.getPiece(newRow, newCol);
        if (!piece) {
          moves.push([newRow, newCol]);
        } else {
          if (piece.color !== color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    }
    
    return moves;
  }

  getQueenMoves(row, col, color) {
    return [...this.getRookMoves(row, col, color), ...this.getBishopMoves(row, col, color)];
  }

  getKingMoves(row, col, color) {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (this.isValidSquare(newRow, newCol)) {
        const piece = this.getPiece(newRow, newCol);
        if (!piece || piece.color !== color) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }

  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece || piece.color !== this.turn) return false;
    
    const validMoves = this.getValidMoves(fromRow, fromCol);
    const isValidMove = validMoves.some(([r, c]) => r === toRow && c === toCol);
    
    if (!isValidMove) return false;
    
    // Make the move
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    
    // Switch turns
    this.turn = this.turn === 'white' ? 'black' : 'white';
    
    this.moveHistory.push({ from: [fromRow, fromCol], to: [toRow, toCol], piece });
    
    return true;
  }
}

const ChessGame3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const boardGroupRef = useRef(null);
  const piecesGroupRef = useRef(null);
  const raycasterRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  
  const [chess] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameState, setGameState] = useState({ turn: 'white' });

  // Create piece geometries and materials
  const createPieceGeometry = useCallback((type) => {
    switch (type) {
      case 'pawn':
        return new THREE.ConeGeometry(0.15, 0.6, 8);
      case 'rook':
        return new THREE.CylinderGeometry(0.2, 0.2, 0.6, 8);
      case 'knight':
        return new THREE.BoxGeometry(0.3, 0.6, 0.3);
      case 'bishop':
        return new THREE.ConeGeometry(0.15, 0.8, 8);
      case 'queen':
        return new THREE.ConeGeometry(0.2, 0.9, 8);
      case 'king':
        return new THREE.CylinderGeometry(0.25, 0.2, 0.8, 8);
      default:
        return new THREE.BoxGeometry(0.3, 0.3, 0.3);
    }
  }, []);

  const createPieceMaterial = useCallback((color) => {
    return new THREE.MeshPhongMaterial({
      color: color === 'white' ? 0xf0f0f0 : 0x404040,
      shininess: 100
    });
  }, []);

  const createScene = useCallback(() => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 8);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Create chess board
    const boardGroup = new THREE.Group();
    const squareSize = 1;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const geometry = new THREE.PlaneGeometry(squareSize, squareSize);
        const isLight = (row + col) % 2 === 0;
        const material = new THREE.MeshLambertMaterial({
          color: isLight ? 0xf0d9b5 : 0xb58863
        });
        
        const square = new THREE.Mesh(geometry, material);
        square.rotation.x = -Math.PI / 2;
        square.position.set(
          col * squareSize - 3.5 * squareSize,
          0,
          row * squareSize - 3.5 * squareSize
        );
        square.userData = { row, col, type: 'square' };
        square.receiveShadow = true;
        
        boardGroup.add(square);
      }
    }
    
    scene.add(boardGroup);
    
    // Create pieces group
    const piecesGroup = new THREE.Group();
    scene.add(piecesGroup);
    
    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    boardGroupRef.current = boardGroup;
    piecesGroupRef.current = piecesGroup;
    raycasterRef.current = raycaster;
    
    return { scene, camera, renderer };
  }, []);

  const updatePieces = useCallback(() => {
    if (!piecesGroupRef.current) return;
    
    // Clear existing pieces
    while (piecesGroupRef.current.children.length > 0) {
      piecesGroupRef.current.remove(piecesGroupRef.current.children[0]);
    }
    
    // Add pieces based on current board state
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = chess.getPiece(row, col);
        if (piece) {
          const geometry = createPieceGeometry(piece.type);
          const material = createPieceMaterial(piece.color);
          const pieceMesh = new THREE.Mesh(geometry, material);
          
          pieceMesh.position.set(
            col - 3.5,
            0.3,
            row - 3.5
          );
          pieceMesh.castShadow = true;
          pieceMesh.userData = { row, col, piece, type: 'piece' };
          
          piecesGroupRef.current.add(pieceMesh);
        }
      }
    }
  }, [chess, createPieceGeometry, createPieceMaterial]);

  const highlightSquares = useCallback(() => {
    if (!boardGroupRef.current) return;
    
    // Reset all square colors
    boardGroupRef.current.children.forEach((square, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      const isLight = (row + col) % 2 === 0;
      
      if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
        square.material.color.setHex(0xffff00); // Yellow for selected
      } else if (validMoves.some(([r, c]) => r === row && c === col)) {
        square.material.color.setHex(0x00ff00); // Green for valid moves
      } else {
        square.material.color.setHex(isLight ? 0xf0d9b5 : 0xb58863); // Normal colors
      }
    });
  }, [selectedSquare, validMoves]);

  const handleClick = useCallback((event) => {
    if (!raycasterRef.current || !cameraRef.current || !sceneRef.current) return;
    
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
    
    if (intersects.length > 0) {
      const intersect = intersects[0];
      const userData = intersect.object.userData;
      
      if (userData.type === 'square' || userData.type === 'piece') {
        const { row, col } = userData;
        
        if (selectedSquare) {
          // Try to make a move
          const [fromRow, fromCol] = selectedSquare;
          const moveSuccess = chess.makeMove(fromRow, fromCol, row, col);
          
          if (moveSuccess) {
            setSelectedSquare(null);
            setValidMoves([]);
            setGameState({ turn: chess.turn });
            updatePieces();
          } else if (chess.getPiece(row, col)?.color === chess.turn) {
            // Select new piece
            setSelectedSquare([row, col]);
            setValidMoves(chess.getValidMoves(row, col));
          } else {
            // Deselect
            setSelectedSquare(null);
            setValidMoves([]);
          }
        } else {
          // Select piece
          const piece = chess.getPiece(row, col);
          if (piece && piece.color === chess.turn) {
            setSelectedSquare([row, col]);
            setValidMoves(chess.getValidMoves(row, col));
          }
        }
      }
    }
  }, [chess, selectedSquare, updatePieces]);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const { scene, camera, renderer } = createScene();
    mountRef.current.appendChild(renderer.domElement);
    
    updatePieces();
    
    // Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const handleMouseDown = (event) => {
      if (event.button === 2) { // Right mouse button for rotation
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };
    
    const handleMouseMove = (event) => {
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };
        
        const deltaRotationQuaternion = new THREE.Quaternion()
          .setFromEuler(new THREE.Euler(
            deltaMove.y * 0.01,
            deltaMove.x * 0.01,
            0,
            'XYZ'
          ));
        
        camera.position.applyQuaternion(deltaRotationQuaternion);
        camera.lookAt(scene.position);
        
        previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };
    
    const handleMouseUp = () => {
      isDragging = false;
    };
    
    const handleWheel = (event) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
      camera.lookAt(scene.position);
    };
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    // Event listeners
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [createScene, updatePieces, handleClick]);

  useEffect(() => {
    highlightSquares();
  }, [highlightSquares]);

  const resetGame = () => {
    chess.board = chess.createInitialBoard();
    chess.turn = 'white';
    chess.moveHistory = [];
    setSelectedSquare(null);
    setValidMoves([]);
    setGameState({ turn: 'white' });
    updatePieces();
  };

  return (
    <div className="w-full h-screen relative bg-gray-900">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">3D Chess</h2>
        <p className="mb-2">Turn: <span className="capitalize font-semibold">{gameState.turn}</span></p>
        <button 
          onClick={resetGame}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
        >
          Reset Game
        </button>
      </div>
      
      {/* Controls Info */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Controls:</h3>
        <ul className="text-sm space-y-1">
          <li>• Left click: Select/Move pieces</li>
          <li>• Right click + drag: Rotate view</li>
          <li>• Mouse wheel: Zoom in/out</li>
        </ul>
      </div>
    </div>
  );
};

export default ChessGame3D;