import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from "react";

const SearchableSelectEditor = forwardRef((props: any, ref) => {
    const [selectedValue, setSelectedValue] = useState(props.value || '');
    const inputRef = useRef<HTMLSelectElement>(null);

    const values = props?.values || [];

    useImperativeHandle(ref, () => ({
        getValue() {
            return selectedValue;
        },
        isCancelBeforeStart() {
            return false;
        },
        isCancelAfterEnd() {
            return false;
        },
    }));

    useEffect(() => {
        setSelectedValue(props.value || '');
    }, [props.value]);

    useEffect(() => {
        if (selectedValue !== props.value) {
            props.stopEditing();
        }
    }, [selectedValue, props]);

    const handleChange = (event: any) => {
        setSelectedValue(event.target.value);

        if (props.onValueChange) {
            props.onValueChange(event.target.value);
        }
    };

    return (
        <div className="ag-custom-component-popup">
            <select
                ref={inputRef}
                value={selectedValue}
                onChange={handleChange}
                className="form-control"
                style={{ width: '200px', height: '35px' }}
            >
                <option value="" disabled>Select an option</option>
                {values.map((option: any) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
});

export default SearchableSelectEditor;
