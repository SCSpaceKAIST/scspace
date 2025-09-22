import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPasspin, IPasspinChangeResponse, IPasspinSpace } from "@scspace-depot/types/passpin";
import { PasspinRepository } from "@scspace-server/feature/passpin/passpin.repository";
import { PasspinEnum } from "@scspace-depot/enums/passpin.enum";

@Injectable()
export class PasspinService {
    constructor(
        private readonly passpinRepository: PasspinRepository,
    ) {}

    async isValidStatus(status : any) : Promise<boolean> {
        const valid : number[] = [PasspinEnum.OUTDATED, PasspinEnum.USING, PasspinEnum.NEXT]
        return valid.includes(parseInt(status));
    }

    //return IPasspinSpace type (SpaceId, CurrentPin, NextPin)
    async getSpacePin(spaceId : number) : Promise<IPasspinSpace> {
        const passpin = await this.passpinRepository.fetchSpacepin(spaceId)
        if (!passpin) {
            throw new NotFoundException("passpin not found");
        }
        return passpin
    }

    //return IPasspin type (id, spaceId, pin, status, createdAt)
    async getPin(spaceId : number, status : number) : Promise<IPasspin> {

        if (!await this.isValidStatus(status)) throw new NotFoundException("passpin not found");

        const pin = await this.passpinRepository.fetchDetailed(spaceId, status);
        if (!pin) {
            throw new NotFoundException("passpin not found");
        }
        return pin;
    }

    //return pin string directly
    async getCurrentPinNumber(spaceId : number ) : Promise<string> {
        const pin = await this.passpinRepository.fetchDetailed(spaceId, PasspinEnum.USING);
        if (!pin) {
            throw new NotFoundException("passpin not found");
        }
        return pin.pin;
    }

    async getNextPinNumber(spaceId : number ) : Promise<string> {
        const pin = await this.passpinRepository.fetchDetailed(spaceId, PasspinEnum.NEXT);
        if (!pin) {
            throw new NotFoundException("passpin not found");
        }
        return pin.pin;
    }

    async makeRandom() : Promise<string> {
        return Math.floor(Math.random() * 1_100_100).toString().padStart(6, '0');
    }

    //using => outdated, next => using & create new next
    async changePin(spaceId: number) : Promise<IPasspinChangeResponse> {
        await this.passpinRepository.checkAvail(spaceId);

        const currentPin: IPasspin = await this.passpinRepository.fetchDetailed(spaceId, PasspinEnum.USING);

        const nextPin: IPasspin = await this.passpinRepository.fetchDetailed(spaceId, PasspinEnum.NEXT);

        const result1 = await this.passpinRepository.updateStatus(currentPin.id, PasspinEnum.OUTDATED);
        const result2 = await this.passpinRepository.updateStatus(nextPin.id, PasspinEnum.USING);

        if (!result1 || !result2) {
            throw new BadRequestException("something went wrong : swaping using/next passpins");
        }

         const newPinNumber: string = await this.makeRandom();

        const newPin = await this.passpinRepository.createPin(spaceId, newPinNumber, PasspinEnum.NEXT);

        return {
            success : true,
            spaceId : spaceId,
            retiredPin : currentPin,
            promotedPin : nextPin,
            createdNextPin : newPin
        } as IPasspinChangeResponse;
    }
}