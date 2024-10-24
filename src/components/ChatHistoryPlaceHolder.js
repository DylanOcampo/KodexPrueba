
import Placeholder from 'react-bootstrap/Placeholder';
export const ChatHistoryPlaceholder = () => {
    return (
        <div style={{paddingTop: "10px", width: "100%", paddingRight: "5px"}}>
            <div className="ChatHistoryPlaceHolderContainer">
                <Placeholder as="p" animation="glow" className="placeHolderOverride">
                <Placeholder className="placeHolderOverride" bg="dark"/>
                
                </Placeholder>


            </div>
        </div>
    )
}