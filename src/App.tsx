
import React, { useState , useEffect} from 'react';
import {Button,Dialog,Container, DialogActions, DialogContent,DialogContentText,DialogTitle, GridList, Menu, MenuItem, Select, TextField, GridListTileBar, GridListTile, makeStyles, Box, Paper, Fab, IconButton,Card, CardHeader, CardActions, CardContent} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { fade } from '@material-ui/core/styles/colorManipulator';


import './main.css';
import zIndex from '@material-ui/core/styles/zIndex';



const useStyles = makeStyles((theme) => ({
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        
    },
    gridTitleBar: {
        color: theme.palette.primary.dark
    },
    tile: {
         backgroundColor: theme.palette.info.light,
         width:'200px',
        maxWidth: "200px",
        margin: '2px',
    },
  
    paper: {
        background: fade('#111111',0.5),
        maxWidth: 'maxwidth',
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
        
    },
    cateGoryTitle: {
        background: theme.palette.primary.dark,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        position: 'relative'
    },
    close: {
    
    },
    delete:{
        float: 'right',
    },
    entryHeader: {
        background: theme.palette.info.dark,
    },
    row: {
        marginBottom: "50px",
        position: 'relative',
    },
    rowBackground: {
        position:'relative',
        top: '-15px',
        zindex: -1,
        backdropFilter: "blur(3px)",
    },
    inputs: {
        padding: '5px',
    }
}))



const useLocalStorageState = (localkey:any) =>{
    const [value,setValue] = useState(
        JSON.parse(localStorage.getItem(localkey)!) || []
    );

    useEffect(() => {
        localStorage.setItem(localkey, JSON.stringify(value));
    }, [value]);

    
    return [value,setValue]
}

const entryTemplate = {
    id:'',
    title:'Example',
    desc:'',
    category:'',
    date: 'no deadline',
    imageURL: ''
}

const categoryTemplate = {
    id: '',
    title: 'exmample',
    hidden: true,
}

const App = (props: any) => {
    const [Categories,setCategories] = useLocalStorageState('Category');
    const [newEntry, setNewEntry] = useState(false);
    const [newCategory, setNewCategory] = useState(false);
    const [entries,setEntries] = useState(JSON.parse(localStorage.getItem('Entries')!) || []);
    const [categoryAdd, setCategoryAdd] = useState(categoryTemplate)
    const [defaultCategory, setDefaultCategory] = useState('');


    // entry data
    const [entryData,setEntryData] = useState(entryTemplate);


    const toggle = () => {
      setNewEntry(!newEntry);
    };

    const toggleNewCategory = () => {
      setNewCategory(!newCategory);
    };

    const entryChange = (event: any)=>{
        const data = event.target.value;
        setEntryData(
            {
                ...entryData,
                [event.target.name]: data   
            });
    }
    const entryAdd = () => {
        toggle();
        const copy:any = entries;
        copy.push(entryData)
        setEntries(copy);
        localStorage.setItem('Entries', JSON.stringify(copy));

        //set cat to visible
        toggleCategory(entryData.category,false);
    }

    const toggleCategory = (title: string, visible: boolean) => {
        let newArray: any =[]
        for(let cat of Categories){
            if(cat.id == title)
                cat.hidden= visible;
            newArray.push(cat);
        }
        setCategories(newArray);
    }
    const categoryChange = (event:any) => {
        setCategoryAdd(
            {
                ...categoryAdd,
            title: event.target.value,
            id: Math.random().toString(36).substr(2,9),
            }
        )
    }
    const addCategory = (e: any) => {
       
        toggleNewCategory();
        const c: any= Categories;
        c.push(categoryAdd);
        setCategories(c);  
    }


    const clearAll = () => {
        setCategories([]);
        setEntries([]);
        localStorage.clear();
    }
    
    const addNewToCategory = (cat:string) => {
        setDefaultCategory(cat); toggle(); 
                            
        setEntryData({
             ...entryData,
            category: cat   
         });
                            
    }
    document.body.style.backgroundColor = "linear-gradient(0deg, rgba(19,0,19,1) 0%, rgba(5,63,69,1) 100%);"

    const deleteEntry = (ent:any) => {
       let newArr:any = [];
       for(var i= 0, len = entries.length; i< len;i ++){
           if(entries[i] != ent){
                newArr.push(entries[i]);
           }
       }
       setEntries(newArr);
       localStorage.setItem('Entries', JSON.stringify(newArr));
       
    };

    const deleteCategory= (cattoDelete: string) => {
        let newArr:any = [];
        for(let cat of Categories){
            if(cat.id != cattoDelete)
                newArr.push(cat);
        };
        setCategories(newArr);
    }

    const classes = useStyles();
    
    return (
        <div className = 'root'>
             <IconButton  aria-label="add category" onClick={toggleNewCategory}>
                <AddCircleIcon fontSize="small" />
             </IconButton>


             <IconButton aria-label="delete" onClick={ () => {clearAll()}} className = {classes.delete}>
                <DeleteIcon fontSize="small" />
             </IconButton>

            <Dialog open = {newEntry} maxWidth = "md" fullWidth >
                <DialogContent>
                    <form >
                        <TextField name = "title"  onChange = {event => entryChange(event) } className = {classes.inputs}
                            autoFocus label = "Entry Title" fullWidth required variant = 'filled'
                        />  
                        
                        <TextField name = "date" label = "Due date" type = "date"  InputLabelProps={{ shrink: true, }} 
                         className = {classes.inputs}
                        onChange = {event => entryChange(event)} 
                        variant = 'filled'
                        /> 
                         
                        <TextField name = "desc"  onChange = {event => entryChange(event)}
                             label = "Description" fullWidth multiline rowsMax = {25} variant = 'filled'
                            className = {classes.inputs}
                        />              

                   </form>                   
                </DialogContent>

            <DialogActions>
                <Button type="submit"  onClick={entryAdd} color = "primary"> Add entry</Button>
                <Button onClick={toggle} color = "primary"> Cancel</Button>
            </DialogActions>
            </Dialog>


            <Dialog open = {newCategory} maxWidth = "md" fullWidth >
                <DialogContent>
                    <form >
                        <TextField name = "category"  onChange = {event => categoryChange(event)}
                            autoFocus label = "Category name" fullWidth required
                        />  

                   </form>                   
                </DialogContent>

                <DialogActions>
                    <Button onClick={ e => addCategory(e)} color = "primary"> Add category</Button>
                    <Button onClick={toggleNewCategory} color = "primary"> Cancel</Button>
                </DialogActions>
            </Dialog>
        
            {
            Categories.map( (cat:any) => {
                return(
                    <div className = {classes.row}>
                        <Paper className = {classes.cateGoryTitle}>
                            {cat.title}
                            
                            <IconButton aria-label="delete" onClick={ () => {deleteCategory(cat.id)}} className = {classes.delete}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="add" onClick={() => {addNewToCategory(cat.id)}} className = {classes.delete}>
                                <AddIcon fontSize="small" />
                            </IconButton>

                            
                            <IconButton aria-label="expand" onClick={() => {toggleCategory(cat.id,!cat.hidden)}} className = {classes.delete}>
                                            
                                            {
                                                (() => {
                                                    if (cat.hidden) {
                                                        return (
                                                             <ArrowDropDownIcon  fontSize="small"/>
                                                        );
                                                    }
                                                    else{
                                                        return (
                                                             <ArrowDropUpIcon   fontSize="small" />
                                                        );
                                                    }
                                                })()
                                            }           

                               
                                            
                           </IconButton>
                                    
                            
                        </Paper>
                        
                        {(() => {
                            if(cat.hidden == false){
                                return(
                                    <div className={classes.rowBackground}>
                                    <Paper className = {classes.paper}> 
                                        <GridList className ={classes.gridList}>
                                            {entries.map((entry:any) => {
                                                if(cat.id == entry.category){
                                                return(
                                                    <Card className = {classes.tile}>
                                                        <CardHeader
                                                            title = {entry.title}
                                                            className = {classes.entryHeader}
                                                        />
                                                        <CardContent> {entry.date}</CardContent>
                                                        <CardActions>
                                                            <IconButton aria-label="delete" onClick={ () => {}}>
                                                                <InfoIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" onClick={ () => {deleteEntry(entry)}} className = {classes.delete}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </CardActions>
                                                    </Card>
                                                )
                                                }
                                            })}
                                        </GridList>
                                    </Paper>
                                    </div>
                                )
                            }
                      })()
                      }

                    </div>
                    );
                })
            }

        </div>
    );
}


export default App;

