import { Injectable } from "@nestjs/common";
import { PASSPIN_LENGTH } from "@scspace-depot/consts/passpin.const";
import { PasspinEnum } from "@scspace-depot/enums/passpin.enum";

@Injectable()
export class PasspinUtils {
    constructor() { }
    /**
     * Check if the value is a valid string for passpin (6-digit && no char)
     *
     * @param val
     */
    isValidString(val: string): boolean {
        if (val.length !== PASSPIN_LENGTH) return false;
        return new RegExp(`^\\d{${PASSPIN_LENGTH}}$`).test(val);
    }

    /**
     * Check if the value is a valid status for passpin, i.e. 0 or -1
     *
     * @param status
     */
    isValidStatus(status: any): boolean {
        const valid: number[] = [PasspinEnum.OUTDATED, PasspinEnum.USING]
        return valid.includes(parseInt(status));
    }

    /**
     * Make a random 6-digit string
     *
     * @returns random 6-digit string
     */
    makeRandomPin(): string {
        const res = Math.floor(Math.random() * 1_000_000)
            .toString()
            .padStart(PASSPIN_LENGTH, '0');
        if (this.isValidString(res)) {
            return res;
        }
        else throw new Error("something went wrong : makeRandom");
    }
}