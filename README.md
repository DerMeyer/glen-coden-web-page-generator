# Glen Coden Web Page Generator v3

## Scripts

Any scripts listed in the [Create React App Docs](https://github.com/facebook/create-react-app) will run in this project.

## Commands

### `yarn make <project-name>`


Selects the project with ```<project-name>``` in your project directory, if it already exists.<br />
Otherwise bootstraps a project with ```<project-name>```.<br />
Implements changes in current project, if ```<project-name>``` is not specified.

### `yarn optimize <project-name>`

Generates optimized assets for ```<project-dir>/static/images/```, ```<project-dir>/static/icons/``` and ```<project-dir>/static/logo.png```.<br />
Configure in ```optimizer/optimize-config.json```.<br />
Executes for the most recently selected project, if ```<project-name>``` is not specified.

Min widths for best results: Images 2500px, Icons 1024px, Logo 512px.

## Requirements

Add ```/projects``` directory.<br />
Expose your [Tinify API Key](https://tinypng.com/developers) in ```/confidential.json```.

```
Example:

{
   "TINIFY_API_KEY": "ABCD..."
}
```
