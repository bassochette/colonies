import { Injectable, Logger } from '@nestjs/common';
import { Client, Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from './ICommandHandler';
import { MemberService } from '../member/member.service';

import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { ResourcesHandler } from './game/resources/resources.handler';
import { RecruitHandler } from './game/recruit/recruit.handler';
import { TroopsHandler } from './game/troops/troops.handler';
import { WorkHandler } from './game/work/work.handler';
import { BuildHandler } from './game/buidlings/build/build.handler';
import { BuildingsHandler } from './game/buidlings/buildings/buildings.handler';

@Injectable()
export class CommandsService {
  commandHandlers: ICommandHandler[] = [];

  constructor(
    // dependencies
    private readonly memberService: MemberService,

    // user handlers
    private readonly pingHandler: PingHandler,
    private readonly inviteHandler: InviteHandler,
    private readonly helpHandler: HelpHandler,
    private readonly statusHandler: StatusHandler,
    private readonly gameResourcesHandler: ResourcesHandler,
    private readonly gameRecruitementHandler: RecruitHandler,
    private readonly gameTroopsHandler: TroopsHandler,
    private readonly gameWorkHandler: WorkHandler,
    private readonly gameBuildingBuildHandler: BuildHandler,
    private readonly gameBuildingsListHandler: BuildingsHandler,
  ) {
    this.commandHandlers = [
      pingHandler,
      inviteHandler,
      helpHandler,
      statusHandler,
      gameResourcesHandler,
      gameRecruitementHandler,
      gameTroopsHandler,
      gameWorkHandler,
      gameBuildingBuildHandler,
      gameBuildingsListHandler,
    ];
  }
  register(client: Client) {
    for (const command of this.commandHandlers) {
      Logger.log(`${command.name} registered`, 'CommandExplorer');
    }

    client.on('message', async message => await this.messageHandler(message));
  }

  async messageHandler(message: Message) {
    if (message.author.bot) return;
    const { content } = message;
    for (const handler of this.commandHandlers) {
      if (handler.test(content)) {
        try {
          Logger.debug(`executing command [${handler.name}] => ${content}`);
          await this.memberService.markInteraction(message.author.id);
          await handler.execute(message);
        } catch (error) {
          Logger.error(error.message, error.stack);
          const errorEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle(error.message)
          message.channel.send(errorEmbed);
        }
        return;
      }
    }
  }
}
