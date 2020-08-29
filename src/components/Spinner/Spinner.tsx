import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import './Spinner.scss';

type Props = ReturnType<typeof mapStateToProps> & {
    fixed?: "fixed";
}

const Spinner:React.FC<Props> = ({ loading, fixed }) => {

    if(!loading) return null;

    return (
        <div className={`main-preloader ${fixed}`}>
            <div className="pulse">
        </div></div>
    );
};

const mapStateToProps = (state: RootState) => ({
    loading: state.auth.loading,
});

export default connect(mapStateToProps)(Spinner);