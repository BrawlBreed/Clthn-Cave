using Godot;
using System;
using System.Collections.Generic;
using System.Threading;

namespace Chess
{
	[Tool]
	public partial class GameManager : Node2D
	{
        [Signal]
        public delegate void PlayerMoveStartedEventHandler(int playerPiece, int enemyPiece);

        [Signal]
        public delegate void EnemyMoveStartedEventHandler(int playerPiece, int enemyPiece);

        [Signal]
        public delegate void PiecesStoredEventHandler(int playerPiece, int playerSquare, int enemyPiece, int enemySquare, bool isPlayerAttacking);

		[Export]
		public int depth = 4;

		public bool CanMove = true;

		public int gameState = 0;

		private Board board;

		private BoardUI boardUI;

		private AI aI;

		private AudioStreamPlayer moveSound;
		private AudioStreamPlayer captureSound;

		private int selectedPieceSquare;
		private bool isPieceSelected;

		private List<Move> legalMoves;

		private bool turnPlayer = true;
		private bool calculating = false;

		// Called when the node enters the scene tree for the first time.
		public override void _Ready()
		{
			boardUI = GetNode<BoardUI>("BoardUI");
			moveSound = GetNode<AudioStreamPlayer>("MoveSound");
			captureSound = GetNode<AudioStreamPlayer>("CaptureSound");

			board = new Board();
			
			/*
			if (GetNode<BoardData>("/root/BoardData").board == null) 
			{
				board = new Board();
				GetNode<BoardData>("/root/BoardData").board = board;
			}
			else 
			{
				board = GetNode<BoardData>("/root/BoardData").board;
			}
			*/

			aI = new AI(depth);

			legalMoves = new List<Move>();

			board.CreateBoard();
		}

		private bool IsInBounds(int x, int y)
		{
			return (x >= 0 && x < 8 && y >= 0 && y < 8);
		}

		// Called every frame. 'delta' is the elapsed time since the previous frame.
		public override void _Process(double delta)
		{
			if (!Engine.IsEditorHint() && CanMove && (gameState == 0))
			{
				if (turnPlayer)
				{
					if (Input.IsActionJustPressed("action_select"))
					{
						// get mouse position
						Vector2 mouse = GetViewport().GetMousePosition() - boardUI.Position;

						// get position in grid
						int squareX = (int)(mouse.X / boardUI.tileSize);
						int squareY = (int)(mouse.Y / boardUI.tileSize);
						int selectedSquare = squareX + squareY * 8;

						// check if it is inside the bounds
						if (IsInBounds(squareX, squareY))
						{
							// get the piece if there is one
							if (!Piece.IsPieceType(board.pieces[selectedSquare], Piece.none) && Piece.IsPieceColor(board.pieces[selectedSquare], Piece.white))
							{
								selectedPieceSquare = selectedSquare;
								isPieceSelected = true;

								legalMoves = MoveGeneration.GenerateLegalMoves(board, selectedSquare);
							}
							else
							{
								legalMoves.Clear();
							}
						}
						else
						{
							legalMoves.Clear();
						}
					}
					else if (Input.IsActionJustReleased("action_select"))
					{
						if (isPieceSelected)
						{
							// get mouse position
							Vector2 mouse = GetViewport().GetMousePosition() - boardUI.Position;

							int squareX = (int)(mouse.X / boardUI.tileSize);
							int squareY = (int)(mouse.Y / boardUI.tileSize);
							int targetSquare = squareX + squareY * 8;

							// check if it is inside the bounds
							if (IsInBounds(squareX, squareY))
							{
								foreach (var move in legalMoves)
								{
									if (targetSquare == move.targetSquare)
									{
										if (Piece.IsPieceType(board.pieces[targetSquare], Piece.none)) moveSound.Play();
										else captureSound.Play();

										board.MakeMove(move);
										StorePieces(move);

										turnPlayer = false;

										legalMoves.Clear();

										EmitSignal(SignalName.EnemyMoveStarted);

										break;
									}
								}
							}

							boardUI.UpdateBoardPieces(board);

							isPieceSelected = false;
						}
					}

					if (Input.IsActionPressed("action_select"))
					{
						if (isPieceSelected)
						{
							// get mouse position
							Vector2 mouse = GetViewport().GetMousePosition() - boardUI.Position;

							Sprite2D piece = boardUI.piecesSprites[selectedPieceSquare];
							piece.Position = mouse + new Vector2(-boardUI.tileSize / 2f, -boardUI.tileSize / 2f);
							piece.ZIndex = 1;
						}
					}
				}
				else
				{
					/* 
						I DONT THINK THIS IS THE RIGHT WAY TO DO THIS
						IF I DONT USE A THREAD, IF IT TAKES "TOO MUCH TIME"
						WINDOWS WILL THINK IT STOPPED WORKING,
						I AM NOT REALLY HAPPY WITH THIS SOLUTION
					*/
					if(!calculating)
					{
						calculating = true;

						System.Threading.Thread t = new System.Threading.Thread(new ThreadStart(ComputerTurn));

						t.Start();
					}
				}

				boardUI.ResetBoardSquares();
				boardUI.ViewLastMove(board);
				boardUI.ViewLegalMovements(board, legalMoves);
			}
		}

		public void ComputerTurn()
		{
			Move bestMove = aI.GetBestMove(board);

			if (bestMove != null)
			{
				if(Piece.IsPieceType(board.pieces[bestMove.targetSquare], Piece.none)) moveSound.Play();
				else captureSound.Play();

				board.MakeMove(bestMove);
				StorePieces(bestMove);

				boardUI.UpdateBoardPieces(board);

				moveSound.Play();

				turnPlayer = true;

				calculating = false;

				EmitSignal(SignalName.PlayerMoveStarted);

				bool playerCheckMated = true;
				for(int i = 0; i < 64; i++)
				{
					if ((Piece.GetPieceType(board.pieces[i]) != Piece.none) && (Piece.IsPieceColor(board.pieces[i], Piece.white)) && (MoveGeneration.GenerateLegalMoves(board, i).Count > 0))
					{
						playerCheckMated = false;
						break;
					}
				}
				if (playerCheckMated)
				{
					gameState = -1;

					board.lastMove.piecesTaken = true;
					
					for(int i = 0; i < 64; i++)
					{
						if ((Piece.GetPieceType(board.pieces[i]) == Piece.king) && (Piece.IsPieceColor(board.pieces[i], Piece.white)))
						{
							board.lastMove.takenPlayerPiece = board.pieces[i];
							board.lastMove.takenPlayerSquare = i;

							GD.Print(GD.VarToStr(new Vector2I(i % 8, (i - (i % 8)) / 8)));
							break;
						}
					}
					
					GD.Print(GD.VarToStr(new Vector2I(board.lastMove.targetSquare % 8, (board.lastMove.targetSquare - (board.lastMove.targetSquare % 8)) / 8)));

					board.lastMove.takenEnemyPiece = board.pieces[board.lastMove.targetSquare];
					board.lastMove.takenEnemySquare = board.lastMove.targetSquare;
					board.lastMove.isPlayerAttacking = false;

					StorePieces(board.lastMove);
					GD.Print("Player Checkmated");
				}
			}
			else
			{
				gameState = 1;

				board.lastMove.piecesTaken = true;

				board.lastMove.takenPlayerPiece = board.pieces[board.lastMove.targetSquare];
				board.lastMove.takenPlayerSquare = board.lastMove.targetSquare;

				for(int i = 0; i < 64; i++)
				{
					if (Piece.GetPieceType(board.pieces[i]) != Piece.king)
					{
						board.lastMove.takenEnemyPiece = board.pieces[i];
						board.lastMove.takenEnemySquare = i;
					}
				}

				board.lastMove.isPlayerAttacking = true;

				StorePieces(board.lastMove);
				GD.Print("Enemy Checkmated");
			}
		}

		public void CreateBoardUI(bool IsEnemyBlack)
		{
			board.isEnemyBlack = IsEnemyBlack;
			boardUI.CreateBoardUI(board);
		}

		private void StorePieces(Move move)
		{
			if (move.piecesTaken)
			{
				EmitSignal(SignalName.PiecesStored, Piece.GetPieceType(move.takenPlayerPiece), move.takenPlayerSquare, Piece.GetPieceType(move.takenEnemyPiece), move.takenEnemySquare, move.isPlayerAttacking);

				move.piecesTaken = false;
				move.takenPlayerPiece = 0;
				move.takenEnemyPiece = 0;
			}
		}

		public void SetPiece(int square, int type, bool isWhite)
		{
			if (type == Piece.none) board.pieces[square] = Piece.none;
			else
			{
				int color = (isWhite) ? Piece.white : Piece.black;
				board.pieces[square] = type | color | Piece.moved;
			}

			boardUI.UpdateBoardPieces(board);
		}
	}
}
