import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import format from "date-fns/format";
import ruLocale from "date-fns/locale/ru";
import DateFnsUtils from "@date-io/date-fns";

type Props = ReturnType<typeof mapDispatchToProps>;

const DateRange:React.FC<Props> = ({ startDateAction, endDateAction }) => {
    const [startDate, setStartDate] = useState<Date | null>(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const [endDate, setEndDate] = useState<Date | null>(
        new Date()
    );
    
    const startDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    const endDateChange = (date: Date | null) => {
        setEndDate(date);
    };

    useEffect(() => {
        if(startDate) {
            startDateAction(startDate);
        }
    }, [startDate, startDateAction]);

    useEffect(() => {
        if(endDate) {
            endDateAction(endDate);
        }
    }, [endDate, endDateAction]);


    return (
        <MuiPickersUtilsProvider utils={RuLocalizedUtils} locale={ruLocale}>
            <div className="dateRight">
                <DatePicker 
                    format="d MMMM yyyy"
                    cancelLabel="отмена"
                    value={startDate} 
                    onChange={startDateChange} />
                <span className="arrow">-</span>
                <DatePicker 
                    format="d MMMM yyyy"
                    cancelLabel="отмена"
                    value={endDate} 
                    onChange={endDateChange} />
            </div>
        </MuiPickersUtilsProvider>
    );
}

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    startDateAction: (startDate: Date) => dispatch(actions.moderation.startDateAction(startDate)),
    endDateAction: (endDate: Date) => dispatch(actions.moderation.endDateAction(endDate)),
});

export default connect(null, mapDispatchToProps)(DateRange);

class RuLocalizedUtils extends DateFnsUtils {
    getCalendarHeaderText(date: any) {
        return format(date, "LLLL", { locale: this.locale });
    }

    getDatePickerHeaderText(date: any) {
        return format(date, "dd MMMM", { locale: this.locale });
    }
}