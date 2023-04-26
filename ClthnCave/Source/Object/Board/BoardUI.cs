using Godot;
using System;
using System.Collections.Generic;

namespace Chess
{
	[Tool]
	public partial class BoardUI : Node2D
	{
		[Export]
		public PieceTheme pieceTheme;

		[Export]
		public Texture2D squareTexture;

		[Export]
		public float boardScale = 1;

		[Export]
		public int tileSize = 42;

		public Sprite2D[] piecesSprites = new Sprite2D[64];
		private Sprite2D[] squaresSprites = new Sprite2D[64];

		private Sprite2D boardSprite;

		// Called when the node enters the scene tree for the first time.
		public override void _Ready()
		{
			boardSprite = GetNode<Sprite2D>("BoardSprite");

			boardSprite.Texture = pieceTheme.boardSprite;
			boardSprite.Scale = Vector2.One * boardScale;
		}

		public void CreateBoardUI(Board board)
		{
			for(int y = 0; y < 8; y++)
			{
				for(int x = 0; x < 8; x++)
				{
					/* GET THE INDEX AND PIECE OF THE BOARD */

					int i = x + y * 8;
					int piece = board.pieces[i];

					/* CREATE SQUARE SPRITES */

					squaresSprites[i] = new Sprite2D();
					squaresSprites[i].Position = new Vector2(x * tileSize, y * tileSize);
					squaresSprites[i].Texture = squareTexture;
					squaresSprites[i].SelfModulate = new Color(0, 0, 0, 0);
					squaresSprites[i].Centered = false;
					squaresSprites[i].Scale = new Vector2(tileSize / squareTexture.GetSize().X, tileSize / squareTexture.GetSize().Y);

					AddChild(squaresSprites[i]);

					/* CREATE PIECE SPRITES */

					piecesSprites[i] = new Sprite2D();
					piecesSprites[i].Position = new Vector2(x * tileSize, y * tileSize);
					piecesSprites[i].Texture = pieceTheme.GetTexture(board.pieces[i]);
					piecesSprites[i].Vframes = 2;
					piecesSprites[i].Frame = pieceTheme.GetFrame(board.pieces[i], board.isEnemyBlack);
					piecesSprites[i].Offset = new Vector2(tileSize / 2, tileSize - pieceTheme.GetYOffset(board.pieces[i]));

					AddChild(piecesSprites[i]);
				}   
			}
		}

		public void UpdateBoardPieces(Board board)
		{
			for(int y = 0; y < 8; y++)
			{
				for(int x = 0; x < 8; x++)
				{
					/* PIECES SPRITES POSITIONS */

					int piece = board.pieces[x + y * 8];

					piecesSprites[x + y * 8].Position = new Vector2(x * tileSize, y * tileSize);
					piecesSprites[x + y * 8].ZIndex = 0;
					piecesSprites[x + y * 8].Texture = pieceTheme.GetTexture(piece);
					piecesSprites[x + y * 8].Vframes = 2;
					piecesSprites[x + y * 8].Frame = pieceTheme.GetFrame(piece, board.isEnemyBlack);
					piecesSprites[x + y * 8].Offset = new Vector2(tileSize / 2, tileSize - pieceTheme.GetYOffset(board.pieces[x + y * 8]));
				}
			}
		}

		public void ResetBoardSquares()
		{
			for(int i = 0; i < 64; i++)
			{
				squaresSprites[i].SelfModulate = new Color(0, 0, 0, 0);
			}
		}

		public void ViewLegalMovements(Board board, List<Move> legalMovements)
		{
			foreach(var move in legalMovements)
			{
				squaresSprites[move.targetSquare].SelfModulate = Piece.IsPieceType(board.pieces[move.targetSquare], Piece.none) ? pieceTheme.colorValidMove : pieceTheme.colorPieceWarning;
			}
		}

		public void ViewLastMove(Board board)
		{
			Move lastMove = board.lastMove;

			if(lastMove != null)
			{
				squaresSprites[lastMove.sourceSquare].SelfModulate = pieceTheme.colorLastMove;
				squaresSprites[lastMove.targetSquare].SelfModulate = pieceTheme.colorLastMove;
			}
		}

	}
}
