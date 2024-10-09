import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import Button, { BUTTON_TYPES } from "../../components/Button";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";

const mockContactApi = () =>
    new Promise((resolve) => {
        setTimeout(resolve, 500);
    });

const Form = ({ onSuccess, onError }) => {
    const [sending, setSending] = useState(false);
    const [key, setKey] = useState(0);

    const sendContact = useCallback(
        async (evt) => {
            evt.preventDefault();

            setSending(true);
            // We try to call mockContactApi
            try {
                await mockContactApi();
                setSending(false);
                onSuccess();

                setKey((prevKey) => prevKey + 1);
            } catch (err) {
                setSending(false);
                onError(err);
            }
        },
        [onSuccess, onError]
    );

    return (
        <form key={key} onSubmit={sendContact}>
            <div className="row">
                <div className="col">
                    <Field placeholder="" label="Nom" />
                    <Field placeholder="" label="Prénom" />
                    <Select
                        selection={["Personel", "Entreprise"]}
                        onChange={() => null}
                        label="Personel / Entreprise"
                        type="large"
                        titleEmpty
                    />
                    <Field placeholder="" label="Email" />
                    <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
                        {sending ? "En cours" : "Envoyer"}
                    </Button>
                </div>
                <div className="col">
                    <Field
                        placeholder="message"
                        label="Message"
                        type={FIELD_TYPES.TEXTAREA}
                        name="message"
                    />
                </div>
            </div>
        </form>
    );
};

Form.propTypes = {
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
};

Form.defaultProps = {
    onError: () => null,
    onSuccess: () => null,
};

export default Form;
