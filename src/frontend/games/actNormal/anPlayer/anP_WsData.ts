import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";
import {ButtonDePressData, ButtonPressData} from "./anP_TouchableButton";

type PlayerWsData = IJoystickUpdateEvent | ButtonPressData | ButtonDePressData;

export default PlayerWsData;
