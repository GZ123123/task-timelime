import { Component, createContext } from "react";
import PropTypes from "prop-types";

const defaultContextState = {
  error: false,
  editing: "",

  setEditing: () => {
    console.warn("default set editing used");
    return;
  },
  setError: () => {
    console.warn("default set error used");
    return;
  },
};

const { Consumer, Provider } = createContext(defaultContextState);

export class GroupProvider extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  setEditing = (newEditing) => {
    this.setState(() => {
      return { editing: newEditing };
    });
  };

  setError = (newError) => {
    this.setState(() => {
      return { error: newError };
    });
  };

  state = {
    error: false,
    editing: null,

    setEditing: this.setEditing,
    setError: this.setError,
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export const GroupConsumer = Consumer;
