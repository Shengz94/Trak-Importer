import { Button } from "@material-ui/core"

const ImportToTrakt = (props) => {

  function importTitles(){

  }

  return (
    <div className="title-list">
        {[...props.titles.values()].map(title => {
            <TitleImport title={title} updateTitle={props.updateTitle} handleImportCheckBox={props.handleImportCheckBox} handleSelectedChange={props.handleSelectedChange}/>
        })}
        <Button onClick={importTitles}>Import titles</Button>
    </div>
  );
};

export default ImportToTrakt;