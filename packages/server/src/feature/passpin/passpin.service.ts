import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPasspin, IPasspinSpace, IPasspinWithSpace } from "@scspace-depot/types/passpin";
import { PasspinRepository } from "@scspace-server/feature/passpin/passpin.repository";
import { PasspinEnum } from "@scspace-depot/enums/passpin.enum";
import { PasspinUtils } from './passpin.utils';

@Injectable()
export class PasspinService {
    constructor(
        private readonly passpinRepository: PasspinRepository,
        private readonly passpinUtils: PasspinUtils,
    ) { }

    /**
     * Check this space's passpin is valid status : It should have only 1 USING pins
     * @param spaceId
     */
    async checkAvail(spaceId: number): Promise<boolean> {
        return await this.passpinRepository.checkAvail(spaceId);
    }

    /**
     * Get the current pin & one previous pin for a given spaceId as IPasspinSpace
     *
     * @param spaceId
     */
    async getSpacePin(spaceId: number): Promise<IPasspinSpace> {
        const passpin = await this.passpinRepository.fetchSpacepin(spaceId)
        if (!passpin) {
            throw new NotFoundException("passpin not found");
        }
        return passpin;
    }

    /**
     * Get the pin with given id as IPasspin
     *
     * @param id
     */
    async getPin(id: number): Promise<IPasspin> {
        const pin = await this.passpinRepository.fetch(id);
        if (!pin) {
            throw new NotFoundException("passpin not found");
        }
        return pin;
    }

    async getActivePins(): Promise<IPasspinWithSpace[]> {
        return await this.passpinRepository.fetchActivePins();
    }

    async getActivePinsByUser(userId: number): Promise<IPasspinWithSpace[]> {
        return await this.passpinRepository.fetchActivePinsByUserId(userId);
    }

    /**
     * OUTDATED - maybe no usage
     * Get the current pin string for a given spaceId
     *
     * @param spaceId
     */
    async getCurrentPinString(spaceId: number): Promise<string> {
        const pin = await this.passpinRepository.fetchDetailed(spaceId, PasspinEnum.USING);
        if (!pin) {
            throw new NotFoundException("passpin not found");
        }
        return pin.pin;
    }

    /**
     * Generate a new IPasspin with given SpaceId, Pin and Status (also add to DB)
     * @param spaceId
     * @param pin : optional, if not given, make random 6-digit string
     * @param stat : optional, if not given, default to PasspinEnum.USING
     * @returns Newly generated IPasspin
     */
    async generatePin(spaceId: number, pin?: string, stat?: number): Promise<IPasspin> {
        const pinString = pin ?? await this.passpinUtils.makeRandomPin();
        if (!this.passpinUtils.isValidString(pinString)) {
            throw new BadRequestException(`Invalid pin string: ${pinString}`);
        }

        const status = stat ?? PasspinEnum.USING;
        if (!this.passpinUtils.isValidStatus(status)) {
            throw new BadRequestException(`Invalid pin status: ${status}`);
        }

        return await this.passpinRepository.createPin(spaceId, pinString, status);
    }

    /**
     * Set the current pin to OUTDATED status
     *
     * @param spaceId
     * @returns Updated IPasspin
     */
    async setOutdated(spaceId: number): Promise<IPasspin> {
        const spacePin = await this.passpinRepository.fetchSpacepin(spaceId);
        const currentPin = spacePin.currentPin;

        const res = await this.passpinRepository.updateStatus(currentPin.id, PasspinEnum.OUTDATED);

        if (res) {
            return await this.passpinRepository.fetch(currentPin.id);
        }
    }

    /**
     * Change the current pin to the given one or generate a new one if not given
     *
     * @param spaceId
     * @param designated
     * @returns Updated IPasspinSpace
     */
    async changePin(spaceId: number, designated?: string): Promise<IPasspinSpace> {
        let previous: IPasspin | null = null;
        try {
            previous = await this.setOutdated(spaceId);
        } catch (err) {
            Logger.warn(`No previous pin to set as OUTDATED for spaceId ${spaceId}`);
        }

        const newpin = designated ?
            await this.generatePin(spaceId, designated, PasspinEnum.USING) :
            await this.generatePin(spaceId);

        return {
            spaceId: spaceId,
            currentPin: newpin,
            previousPin: previous,
            changedAt: newpin.timeCreated
        } as IPasspinSpace;
    }

    async deleteCurrentPin(spaceId: number): Promise<void> {
        const spacePin = await this.passpinRepository.fetchSpacepin(spaceId);
        const currentPin = spacePin.currentPin;

        await this.passpinRepository.deletePin(currentPin.id);
    }

    /**
     * Fetch the older pins for a given spaceId
     *
     * @param spaceId
     * @param limit
     * @param includeCurrent : optional, if true, include the current pin in the result. Default to false.
     * @returns Array of IPasspin
     */
    async getOlderPins(spaceId: number, limit: number, includeCurrent?: boolean): Promise<IPasspin[]> {
        return await this.passpinRepository.fetchOlderPins(spaceId, limit, includeCurrent ?? false);
    }

}

/** OUTDATED
 *
 *     async changePin(spaceId: number) : Promise<IPasspinChangeResponse> {
 *         await this.passpinRepository.checkAvail(spaceId);
 *
 *         const currentPin: IPasspin = await this.passpinRepository.fetchDetailed(spaceId, PasspinEnum.USING);
 *
 *         const nextPin: IPasspin = await this.passpinRepository.fetchDetailed(spaceId, PasspinEnum.NEXT);
 *
 *         const result1 = await this.passpinRepository.updateStatus(currentPin.id, PasspinEnum.OUTDATED);
 *         const result2 = await this.passpinRepository.updateStatus(nextPin.id, PasspinEnum.USING);
 *
 *         if (!result1 || !result2) {
 *             throw new BadRequestException("something went wrong : swaping using/next passpins");
 *         }
 *
 *          const newPinNumber: string = await this.makeRandom();
 *
 *         const newPin = await this.passpinRepository.createPin(spaceId, newPinNumber, PasspinEnum.NEXT);
 *
 *         return {
 *             success : true,
 *             spaceId : spaceId,
 *             retiredPin : currentPin,
 *             promotedPin : nextPin,
 *             createdNextPin : newPin
 *         } as IPasspinChangeResponse;
 *     }
 */