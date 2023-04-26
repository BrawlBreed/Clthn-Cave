using Godot;
using System;

namespace Chess
{
	[Tool]
	public partial class PieceTheme : Resource
	{
		[Export]
		public Texture2D boardSprite;

		[Export]
		public Color colorLastMove;

		[Export]
		public Color colorValidMove;

		[Export]
		public Color colorPieceWarning;

		[Export]
		public Texture2D pawnSprite = new Texture2D();

		[Export]
		public float pawnYOffset = 6;

		[Export]
		public Texture2D rookSprite = new Texture2D();

		[Export]
		public float rookYOffset = 6;

		[Export]
		public Texture2D bishopSprite = new Texture2D();

		[Export]
		public float bishopYOffset = 6;

		[Export]
		public Texture2D knightSprite = new Texture2D();

		[Export]
		public float knightYOffset = 6;

		[Export]
		public Texture2D queenSprite = new Texture2D();

		[Export]
		public float queenYOffset = 6;

		[Export]
		public Texture2D kingSprite = new Texture2D();

		[Export]
		public float kingYOffset = 6;

		[Export]
		public Texture2D blockSprite = new Texture2D();

		[Export]
		public float blockYOffset = 6;

		public Texture2D GetTexture(int piece)
		{
			switch(Piece.GetPieceType(piece))
			{
				case Piece.pawn:
					return pawnSprite;
				case Piece.rook:
					return rookSprite;
				case Piece.bishop:
					return bishopSprite;
				case Piece.knight:
					return knightSprite;
				case Piece.queen:
					return queenSprite;
				case Piece.king:
					return kingSprite;
				case Piece.block:
					return blockSprite;
				default:
					return null;
			}
		}

		public float GetYOffset(int piece)
		{
			switch(Piece.GetPieceType(piece))
			{
				case Piece.pawn:
					return pawnYOffset;
				case Piece.rook:
					return rookYOffset;
				case Piece.bishop:
					return bishopYOffset;
				case Piece.knight:
					return knightYOffset;
				case Piece.queen:
					return queenYOffset;
				case Piece.king:
					return kingYOffset;
				case Piece.block:
					return blockYOffset;
				default:
					return 0;
			}
		}

		public int GetFrame(int piece, bool isEnemyBlack)
		{
			return (((Piece.IsPieceColor(piece, Piece.black) && isEnemyBlack) || (!isEnemyBlack && Piece.IsPieceColor(piece, Piece.white))) ? 1 : 0);
		}
	}
}
