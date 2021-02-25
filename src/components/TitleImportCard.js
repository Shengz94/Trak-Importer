import isNull from "../Helper/Helper";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const TitleImport = (props) => {
  
  return (
    <div className="title-import-card">
      <div className="checkbox-import">
        <input type="checkbox" disabled={isNull(props.title.traktTitle[0])} checked={props.title.import} onChange={() => props.handleImportCheckBox(props.title.id)} />
      </div>
      <div className="right-content">
        <div className="source-name">
          <span><b>Input title</b>: {props.title.sourceTitle}&nbsp;</span>
        </div>
        <div className="trakt-title">
          {!isNull(props.title.selected) ?
            <label>
              <b>Trakt title</b>: 
              <select 
                value={!isNull(props.title.selected) ? JSON.stringify(props.title.selected) : ""} 
                onChange={(e) => props.handleSelectedChange(props.title.id, e.target.value)}>
                  {props.title.traktTitle.map((element) => {
                    return <option key={element.id} value={JSON.stringify(element)}>
                        {"Trakt ID " + element.id + ": " + element.title + " - " + element.year 
                        + " (" + element.type + ")"}
                      </option>
                  })}
              </select>
              <a href={"https://trakt.tv/" + props.title.selected.type + "/" + props.title.selected.slug} target="_blank"><OpenInNewIcon /></a>
            </label>
            :
            <span><b>No title found on Trakt</b></span>
          }
        </div>
      </div>
    </div>    
  );
};

export default TitleImport;