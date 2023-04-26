using Godot;
using System;

namespace Chess
{
    public partial class Move
    {
        public int sourceSquare = 0;
        public int targetSquare = 0;
        public int sourcePiece;
        public int targetPiece;

        // MOVE FLAGS

        public bool canPromote = false;
        public bool canCastle = false;

        public bool piecesTaken = false;
        public int takenPlayerPiece;
        public int takenPlayerSquare;
        public int takenEnemyPiece;
        public int takenEnemySquare;
        public bool isPlayerAttacking;

        // NEEDED FOR CASTLELING
        
        public int rookSquareSource = 0;
        public int rookSquareTarget = 0;
        public int sourceRookPiece;

        public Move(int _sourceSquare, int _targetSquare)
        {
            sourceSquare = _sourceSquare;
            targetSquare = _targetSquare;
        }
    }
}