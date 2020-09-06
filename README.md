## Scripts

Any scripts listed in the [Create React App Docs](https://github.com/facebook/create-react-app) will run in this project.

## Commands

### `yarn glencoden <project-name>`


Selects the project with ```<project-name>``` in your project directory, if it already exists.<br />
Otherwise bootstraps a project with ```<project-name>```.<br />
Generates project files.<br />
Executes for the most recently selected project, if ```<project-name>``` is not specified.

### `yarn glencoden <options>`

#### option ```--list```

Returns a list of projects in your project directory.<br />
The currently selected project is marked by an asterisk (```<current-project> *```).

#### option ```--optimize <project-name> (<image-path>)```

Resizes and minifies all images in ```<project-dir>/static/images/``` to sized listed as ```targetImageSizes``` in ```generator/generator-config.json```.<br />
Creates all logos listed as ```logos``` in ```generator/generator-config.json``` by file ```<project-dir>/static/logo.png```.<br />
Executes for the most recently selected project, if ```<project-name>``` is not specified.

For optimal results, add files of type ```.jpg```, ```.jpeg``` or ```.png``` with a width of 2500px in ```<project-dir>/static/images/>``` and a file ```<project-dir>/static/logo.png``` with min-width 512px.

#### Note:
 
If ```<image-path``` is specified, the image it points at will be replaced by its minified version.

## Add a confidential.json

Setup a projects directory at ```PROJECTS_PATH_SEGMENTS```.<br />
Expose your [Tinify API Key](https://tinypng.com/developers) at ```TINIFY_API_KEY```.

```
Example:

{
   "PROJECTS_PATH_SEGMENTS": ["..", "<my-projects>", "<glen-coden-projects>"],
   "TINIFY_API_KEY": "ABCD..."
}
```

## Style your project

```
{
    "title": "Glen Coden App",
    "description": "This app was created with Glen Coden Web Page Generator.",
    "global": {
        "fontTypes": [
            {
                "name": "Comfortaa",
                "url": "https://fonts.googleapis.com/css?family=Comfortaa&display=swap"
            }
        ],
        "colors": {
            "theme": "#000000",
            "background": ...
        },
        "fontSizes": {
            "h1": 54,
            "h2": ...
        },
        "pageContentSize": ...
```

## Create a structure

Available components are listed in ```generator/components-list.json```.<br />
The ```yarn glencoden``` command will automatically fill your layout with properties listed in ```<component-name>.schema.json``` in the component's directory.

```
"components": [
        {
            "component": "Page",
            "rows": 1,
            "children": [
                {
                    "component": "ZoomBackground"
                },
                {
                    "component": "Row",
                    "alignSelf": "start",
                    "children": [
                        {
                            "component": "Heading",
                            "text": "Welcome to*Glen Coden Generator"
                        }
                    ]
                },
                ...
            ]
        },
        ...
        {
            "component": "LoadingOverlay"
        }
    ]
```

## The workflow

Run your app in development at ```localhost:3000``` with ```yarn start```.<br />
Make changes to ```src/project-config.json```.<br />
Changes to most properties will hot reload. However, for some changes, especially structure, cancel the process and run ```yarn glencoden```.<br />
This will also save the current config structure to ```<project-name>/json/config-history/<time-stamp>```.

## Get your ready-to-deploy web code

Run ```yarn build``` and copy the code inside ```build/``` to your hosting root.<br />

Enjoy finest web code.