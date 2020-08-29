import React from 'react';
import personImg from '../../img/person.jpg';
import passportAfter from '../../img/passportAfter.jpg';
import passportBefore from '../../img/passportBefore.jpg';

const PersonDetail = () => {
    return (
        <div className="personCard">
            <div className="personCard__item">
                <div className="personCard__img">
                    <img src={personImg} alt="person" />
                </div>
                <div className="personCard__identification">Фото идентификация</div>
            </div>
            <div className="personCard__item">
                <div className="personBox">
                    <div className="personBox__item">
                        <div className="personBox__group">
                            <div className="personBox__label">Персональный номер</div>
                            <div className="personBox__desc">23011198400286</div>
                        </div>
                        <div className="personBox__group">
                            <div className="personBox__label">Паспорт серия №</div>
                            <div className="personBox__desc">AN 189 9867</div>
                        </div>
                        <div className="personBox__group">
                            <div className="personBox__label">Дата рождения</div>
                            <div className="personBox__desc">20.08.1979</div>
                        </div>
                        <div>
                            <img src={passportBefore} alt="password" />
                        </div>
                    </div>
                    <div className="personBox__item">
                        <div className="personBox__group">
                            <div className="personBox__label">Дата выдачи паспорта</div>
                            <div className="personBox__desc">20.08.2016</div>
                        </div>
                        <div className="personBox__group">
                            <div className="personBox__label">Орган, выдавший паспорт</div>
                            <div className="personBox__desc">ИММ 50-05</div>
                        </div>
                        <div className="personBox__group">
                            <div className="personBox__label">Срок окончания действия паспорта</div>
                            <div className="personBox__desc">20.08.2026</div>
                        </div>
                        <div>
                            <img src={passportAfter} alt="password" />
                        </div>
                    </div>
                </div>
                <div className="cardNumber">
                    <div className="cardNumber__item">
                        <div className="cardNumber__label">Расчетные счета</div>
                        <div>
                            <p>KGS: 12098989729090999</p>
                            <p>USD: 12098989729090999</p>
                        </div>
                    </div>
                    <div className="cardNumber__item">
                        <div>
                            <p>Visa: 12098989729090999</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonDetail;