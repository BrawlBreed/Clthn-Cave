class_name StateMachine
extends Node

signal state_changed();

var current_state: String; # The current state is a string, you can do the logic needed in any other script.

var states_extensions: Dictionary; # Sorted extensions.
var extensions: Array[StateExtension]; # Unsorted extensions.


# Sets current_state and emits a signal.
func set_state(state: String) -> void:
	if (current_state != state):
		current_state = state;
		
		emit_signal("state_changed");
		
		for extension in states_extensions.get(current_state, []):
			extension.emit_signal("started");


# Adds an extensions to the system.
func add_state_extension(state_extension: StateExtension, target_states: Array) -> void:
	if (is_instance_valid(state_extension.get_parent())):
		state_extension.get_parent().remove_child(state_extension);
	add_child(state_extension);
	
	state_extension.user = get_parent();
	state_extension.state = self;
	
	for state in target_states:
		if (!states_extensions.has(state)):
			states_extensions[state] = [];
		states_extensions[state].push_back(state_extension);
		if (!state_extension in extensions):
			extensions.push_back(state_extension);

# Calls the _update signal in every extensions in the system.
func update_extensions(delta: float = get_physics_process_delta_time(), custom_data: Dictionary = {}) -> void:
	for extension in extensions:
		extension.emit_signal("updated", delta, custom_data);

# Calls the _run signal in every extensions relatted to the current_state.
func run_current_extension(delta: float = get_physics_process_delta_time(), custom_data: Dictionary = {}) -> void:
	for extension in states_extensions.get(current_state, []):
		extension.emit_signal("ran", delta, custom_data);


# This function creates the state machine.
static func setup(start_state: String = "", user: Node = null, machine_name: String = "StateMachine") -> StateMachine:
	var state_machine: = StateMachine.new();
	
	if (is_instance_valid(user)):
		user.add_child(state_machine);
		state_machine.name = machine_name;
	
	state_machine.set_state(start_state);
	
	return state_machine;
