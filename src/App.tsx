
import React, { useState , useEffect} from 'react';
import {Button,Dialog, DialogActions, DialogContent, GridList, TextField, makeStyles, Paper, IconButton,Card, CardHeader, CardActions, CardContent, Typography} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SettingsIcon from '@material-ui/icons/Settings'
import { fade } from '@material-ui/core/styles/colorManipulator';

import {createApi} from 'unsplash-js';

import {Settings} from './components/settings';
import {NewEntry} from './components/newEntry';
import {NewCategory} from './components/newCategory';
import {Warning} from './components/warning';
import './main.css';
import { Message } from '@material-ui/icons';



const useStyles = makeStyles((theme) => ({
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        
    },
    gridTitleBar: {
        color: theme.palette.primary.dark
    },
    tile: {
         backgroundColor: theme.palette.secondary.main,
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
        background: theme.palette.secondary.dark,
        display: 'block',
        overflow: 'hidden',
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

    credits: {
        overflow:   'none',
        position:   'fixed',
        width:      '100%',
        left: 0,
        bottom: 0,
        fontSize: 'small',
        color: theme.palette.info.main,
    },
    links: {
        color: theme.palette.info.main,
    },
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

/*
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

const settingsTemplate = {
    background_type: 'solid',
}
*/

const unsplash_api = createApi({
    accessKey: ""
})




const App = (props: any) => {

    //opening and closing
    const [newEntry, setNewEntry] = useState(false);
    const [newCategory, setNewCategory] = useState(false);
    const [settingsOpen,setSettings] = useState(false);
    const [showWarning, setShowWarning] = useState(false);



    const [Categories,setCategories] = useLocalStorageState('Category');
    const [entries,setEntries] = useState(JSON.parse(localStorage.getItem('Entries')!) || []);
    
    const [defaultCategory, setDefaultCategory] = useState('');
   
    const [useUnsplash, setUseUnsplash] = useState(false);
    

    // data
    const [categoryAdd, setCategoryAdd] = useState(null)
    const [entryData,setEntryData] = useState(null);
    const [backGroundData, setBackgroundData] = useState(null);
    const [backGround, setBackground] = useLocalStorageState('background-url')
    const [settingsData,setSettingsData] = useLocalStorageState('settings-data')

    const [background_resolution, setBackground_resolution] = useState("full")
    const unsplash_query = "Scenery";
    useEffect(() => {
        if(useUnsplash){
            unsplash_api.photos.getRandom({orientation: 'landscape', query: `${unsplash_query}`}).then(result => {
                if(result.errors){
                    console.log("Error involving unsplash: ", result.errors[0]);
                }
                else{
                    const photo: any = result.response;
                    setBackgroundData(photo);
                    unsplash_api.photos.trackDownload({
                        downloadLocation: photo.links.download_location,
                    })
                    
                    switch(background_resolution){
                        case "small":
                            setBackground(photo.urls.small);
                            break;
                        case "regular":
                            setBackground(photo.urls.regular);
                            break;
                        case "full":
                            setBackground(photo.urls.full);
                            break;
                    }
                }
            })
        }else{
            
        }
        
    }, [])

    const toggle = () => {
      setNewEntry(!newEntry);
    };
    const toggleSettings = () => {
        setSettings(!settingsOpen)
    };

    const toggleNewCategory = () => {
      setNewCategory(!newCategory);
    };

    const toggleWarning = () => {
        setShowWarning(!showWarning);
    }

    const entryChange = (event: any)=>{
        const data = event.target.value;
        const entry_Data: any = entryData;
        setEntryData(
            {
                ...entry_Data,
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
        const entry_data: any = entryData;
        toggleCategory(entry_data.category,false);
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
        const cat_data: any = categoryAdd;
        setCategoryAdd(
            {
                ...cat_data,
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
        const entry_data: any = entryData;                         
        setEntryData({
             ...entry_data,
            category: cat   
         });
                            
    }

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
        <div className = 'root' style={{backgroundImage: `url(${backGround})`}}>
            <div>
                {/* Overall buttons*/}
                <IconButton  aria-label="add category" onClick={toggleNewCategory}>
                    <AddCircleIcon fontSize="small" />
                </IconButton>

                <IconButton aria-label="settings" onClick={toggleSettings} className = {classes.delete}>
                    <SettingsIcon fontSize="small" />
                </IconButton>


                <IconButton aria-label="delete" onClick={toggleWarning} className = {classes.delete} >
                    <DeleteIcon fontSize="small" />
                </IconButton>


                {/* Pop up dialogs */}
                <NewEntry open={newEntry} onClose={toggle} EntryAdd = {entryAdd} EntryChange = {entryChange}/>
                
                <NewCategory open={newCategory} onClose = {toggleNewCategory} Change = {categoryChange} Add = {addCategory}  />
            

                <Settings open = {settingsOpen} onClose = {toggleSettings} onConfirm = {() => {toggleSettings()}}/>

                <Warning open={showWarning} onClose = {toggleWarning} onConfirm = { () => {clearAll(); toggleWarning();}} Message='Hi' />
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
                                                                title = {<Typography gutterBottom noWrap variant="h4" >{entry.title}  </Typography>}
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
            
            {(() =>{ // Credit to photos provided by the lovely people who upload to unsplash
                const data: any = backGroundData;
                if(data != null  && useUnsplash == true){

                    return(
                        <text className= {classes.credits}> 
                            Photo by  <a href= {data.user.links.html}  className ={classes.links}>{data.user.name}</a> 
                            on  
                            
                            <a href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral" 
                            className ={classes.links}
                            > Unsplash</a>
                        </text>
                    )
                }else{
                    return(
                        <div className = {classes.credits}>
                            <a
                            href={backGround}
                            className= {classes.links}
                            >Photo</a>
                        </div>
                    )
                }
                
            })()}
        
        </div>
    );
}


export default App;

