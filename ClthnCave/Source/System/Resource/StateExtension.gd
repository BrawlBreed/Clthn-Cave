class_name StateExtension
extends Node

# This is called an extension and it is the scripts that contains states code and handled by the state machine
# This should only be used if the state machine code is big (like in the player case) but not for stuff like simple enemies.

signal started();
signal updated(delta: float, custom_data: Dictionary);
signal ran(delta: float, custom_data: Dictionary);

var user: Node2D; # The user of this script (Example: The player).
var state: StateMachine; # The user state machine.


func _ready() -> void:
	if (has_method("_start")):
		started.connect(Callable(self, "_start"));
	if (has_method("_update")):
		updated.connect(Callable(self, "_update"));
	if (has_method("_run")):
		ran.connect(Callable(self, "_run"));
