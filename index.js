class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {

    	if (arguments.length == 0) {
			throw new Error("data is received");
    	}

    	this.config = config;
    	this.currentState = config.initial;
    	this.history = [config.initial];
    	this.historyPosition = 0;

    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
    	return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {

    	for (var key in this.config.states){

    		if (key === state) {
    			this.currentState = state;
    			this.history.push(state);
    			this.historyPosition++;
    			return;
    		}

    	}

    	throw new Error("State " + "'" + state + "'" + " is not found")
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {

    	var transitions = this.config.states[this.currentState].transitions;

    	for(var transition in transitions) {

    		if(transition === event) {
    			this.currentState = transitions[transition];
    			this.history.push(transitions[transition]);
    			this.historyPosition++;
    			return;
    		}

    	}

    	throw new Error("Event " + "'" + event + "'" + " is not found")
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
    	this.currentState = this.config.initial;
    	this.history.push(this.config.initial);
    	this.historyPosition++;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {

    	var statesArr = [],
    		states = this.config.states;

    	for (var state in states) {

	    	if (arguments.length === 0 ) {
	    		statesArr.push(state)
	    	} else {

	    		for(var transition in this.config.states[state].transitions) {

	    			if (transition === event) {
	    				statesArr.push(state)
	    			}

	    		}

	    	}

    	}
    	return statesArr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
    	if (this.historyPosition === 0) {
    		return false;
    	}
    	this.currentState = this.history[this.historyPosition - 1]
    	this.historyPosition--;
    	return true;

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
    	if ( this.history.length - 1 === this.historyPosition ) {
    		return false;
    	}
    	this.currentState = this.history[this.historyPosition + 1]
    	this.historyPosition++;
    	return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {}
}

const config = {
    initial: 'normal',
    states: {
        normal: {
            transitions: {
                study: 'busy',
            }
        },
        busy: {
            transitions: {
                get_tired: 'sleeping',
                get_hungry: 'hungry',
            }
        },
        hungry: {
            transitions: {
                eat: 'normal'
            },
        },
        sleeping: {
            transitions: {
                get_hungry: 'hungry',
                get_up: 'normal',
            },
        },
    }
};

const student = new FSM(config);

student.changeState('hungry');
student.changeState('busy');
student.trigger('get_tired');
student.reset();
student.undo();
console.log(student.getState())