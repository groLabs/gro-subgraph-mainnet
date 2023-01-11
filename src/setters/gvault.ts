import { initMD } from './masterdata';


export const setNewReleaseFactor = (
    value: i32,
): void => {
    let md = initMD();
    md.gvault_release_factor = value;
    md.save();
}
