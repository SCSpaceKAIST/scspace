import { Controller, Post, Get, Body, Param, ParseIntPipe, Logger } from '@nestjs/common';
import { MatchPredictionRepository } from './match.prediction.repository';
import { IMatchPredictionCreate } from './match.model'; 

@Controller('match')
export class MatchController {
    private readonly logger = new Logger(MatchController.name);

    constructor(private readonly matchRepo: MatchPredictionRepository) {}

    @Post('prediction')
    async createPrediction(@Body() body: IMatchPredictionCreate) { 
        try{
            const insertId = await this.matchRepo.insert(body);
            return {
            status: 'success',
            };
        } catch (error) {
            this.logger.error('Error creating match prediction:', error);
            throw error;
        }
        
    }

    @Get('prediction/:userId')
    async getPredictionsByUserId(@Param('userId', ParseIntPipe) userId: number) {
        try {
            const data = await this.matchRepo.fetchByUserId(userId);
            return {
                status: 'success',
                data: data,
            };
        } catch (error) {
            this.logger.error('Error fetching match predictions:', error);
            throw error;
        }
    }
    
    
    @Get()
    async getAllMatches() {
        try{
            const data = await this.matchRepo.fetchAll();
            return {
            status: 'success',
            data: data,
            };
        }
        catch (error) {
            this.logger.error('Error fetching all matches:', error);
            throw error;
        }
    }

    @Get(':matchId')
    async getMatchById(@Param('matchId', ParseIntPipe) matchId: number) {
        try{
            const data = await this.matchRepo.fetchByMatchId(matchId);
            return {
            status: 'success',
            data: data,
            };
        }
        catch (error) {
            this.logger.error('Error fetching match by ID:', error);
            throw error;
        }
    }
};