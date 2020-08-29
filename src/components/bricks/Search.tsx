import React, { useState } from 'react';
import { FormControl, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const Search = () => {
    const [search, setSearch] = useState('');
    
    return (
        <FormControl variant="outlined" fullWidth size="small" className="search">
            <OutlinedInput
                placeholder="Поиск"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                endAdornment={
                    <InputAdornment position="end">
                        {search 
                            ? 
                                <IconButton edge="end" onClick={() => setSearch('')}>
                                    <CloseIcon />
                                </IconButton>
                            :
                                <IconButton edge="end" onClick={() => setSearch('')}>
                                    <SearchIcon />
                                </IconButton>
                        }
                    </InputAdornment>
                }
            />
        </FormControl>
    );
}

export default Search;