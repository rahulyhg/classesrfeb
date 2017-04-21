import React, { Component } from 'react';

class SelectMenu extends Component {
    constructor(props) {
        super(props);
        const defaultOption      = this.props.defaultOption;
        if(defaultOption){
            this.state = {
                selValue: defaultOption
            };
        }
        else{
            this.state = {
                selValue: ''
            };
        }
    }

    logSelect(cbFunction, e) {
        // e.preventDefault();
        this.setState( {selValue: e.target.value}, () => {
            console.log('state is now: ', this.state);
        });
        console.log('logSelect was called and selValue is: ', e.target.value);
        // Note: state does not update after setState, so you have to access via CB arrow function above.
        // console.log('state is now: ', this.state);
        if( cbFunction ){
            cbFunction(e.target.value);
        }
    }

    render() {
        const selectName    = this.props.selectName;
        const optionsList   = this.props.optionsList;
        const cbFunction    = this.props.cbFunction;

        var Options         = [];
        optionsList.map((value, key) => {
            Options.push(<option value={value.name} key={key}>{value.text}</option>);
            return false;
        });

        if ( selectName.name ){
            if( selectName.defaultClass ){
                return (
                    <select onChange={this.logSelect.bind(this, cbFunction)} name={selectName.name} ref={selectName.name} className={selectName.defaultClass} id={selectName.name} value={this.state.selValue} key={selectName.name}>
                        {Options}
                    </select>
                );
            }
            else{
                return (
                    <select onChange={this.logSelect.bind(this, cbFunction)} name={selectName.name} ref={selectName.name} className="form-control" id={selectName.name} value={this.state.selValue} key={selectName.name}>
                        {Options}
                    </select>
                );
            }

        }
        else{
            return false;
        }
    }
}

export default SelectMenu;