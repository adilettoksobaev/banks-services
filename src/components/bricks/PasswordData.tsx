import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { baseUrl } from '../../utils/baseUrl';
import { IPasswordInfo } from '../../store/Moderation/types';

type Props = ReturnType<typeof mapStateToProps> & {
    passwordInfo: IPasswordInfo,
    imageClickOpen: () => void,
    customerId: number,
    clientInfo?: boolean;
}

const PasswordData:React.FC<Props> = (props) => {
    const { sessionId, customerId, passwordInfo, imageClickOpen, settings, clientInfo } = props;

    return (
        <div className="personInfo">
            {sessionId && settings &&
                <>
                    {clientInfo ? 
                        <div className="personInfo__imgRow">
                            <img src={`${baseUrl()}api/Client/GetUserPhoto/${sessionId}/${customerId}/photo/${settings.apiKey}`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                            <img src={`${baseUrl()}api/Client/GetUserPhoto/${sessionId}/${customerId}/passportFront/${settings.apiKey}`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                            <img src={`${baseUrl()}api/Client/GetUserPhoto/${sessionId}/${customerId}/passportBack/${settings.apiKey}`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                        </div>
                        :
                        <div className="personInfo__imgRow">
                            <img src={`${baseUrl()}api/Moderation/GetUserPhoto/${sessionId}/${customerId}/photo/${settings.apiKey}`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                            <img src={`${baseUrl()}api/Moderation/GetUserPhoto/${sessionId}/${customerId}/passportFront/${settings.apiKey}`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                            <img src={`${baseUrl()}api/Moderation/GetUserPhoto/${sessionId}/${customerId}/passportBack/${settings.apiKey}`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                        </div>
                    }
                </>
            }
            <div className="personInfoRow">
                <div className="personInfo__item">
                    <div className="personInfo__label">Ф.И.О.</div>
                    <div className="personInfo__textField">{passwordInfo.userName}</div>
                </div>
                <div className="personInfo__item">
                    <div className="personInfo__label">Персональный номер</div>
                    <div className="personInfo__textField">{passwordInfo.userInn}</div>
                </div>
                <div className="personInfo__item">
                    <div className="personInfo__label">Номер паспорта</div>
                    <div className="personInfo__textField">{passwordInfo.passportNumber}</div>
                </div>
                <div className="personInfo__item">
                    <div className="personInfo__label">Дата рождения</div>
                    <div className="personInfo__textField">{passwordInfo.dateBirth}</div>
                </div>
                <div className="personInfo__item">
                    <div className="personInfo__label">Дата выдачи паспорта</div>
                    <div className="personInfo__textField">{passwordInfo.dateIssue}</div>
                </div>
                <div className="personInfo__item">
                    <div className="personInfo__label">Орган, выдавший паспорт</div>
                    <div className="personInfo__textField">{passwordInfo.authority}</div>
                </div>
                <div className="personInfo__item">
                    <div className="personInfo__label">Дата окончания срока действия</div>
                    <div className="personInfo__textField">{passwordInfo.dateExpiry}</div>
                </div>
                <div className="passwordData__item">
                    <div className="passwordData__label">Адрес проживания</div>
                    <div className="passwordData__textField">{passwordInfo.registrationAddress}</div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    settings: state.admin.settings,
});

export default connect(mapStateToProps)(PasswordData);