import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import { useState } from "react";

interface Props {
    items: string[];
    checked?: string[];   // optional 
    onChange: (items: string[]) => void; // whats changed - gets sent to redux state
}

export default function CheckBoxButtons({items, checked, onChange}:Props) {
    const [checkedItems, setCheckedItems] = useState(checked || [])
    
    function handleChecked(value: string){
        // checked already or check new item
        const currentIndex = checkedItems.findIndex(item=>item === value);
        let newChecked: string[] = [];
        if(currentIndex === - 1) 
            newChecked = [...checkedItems, value];
        else 
            newChecked = checkedItems.filter(item => item !== value); // uncheck by getting all items other than current value
        
        setCheckedItems(newChecked);
        onChange(newChecked); // return list of items to parent
    }
    
    return (
        <FormGroup>
            {items.map(item => (
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={checkedItems.indexOf(item) !== -1}
                            onClick={() => handleChecked(item)}
                        />
                    } 
                    label={item} 
                    key={item} 
                />
            ))}
        </FormGroup>
    );
}