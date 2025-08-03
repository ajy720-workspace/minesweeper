import { useGameTranslation } from '@/hooks/useTranslation';
import { ButtonMotion, FadeInMotion } from '@/components/ui/motion';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from '../ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '../ui/button';

// Help Modal Component
export const HelpModal = () => {
  const tGame = useGameTranslation();

  const keyboardShortcuts = [
    { key: tGame('help.shortcuts.arrows.key'), description: tGame('help.shortcuts.arrows.description') },
    { key: tGame('help.shortcuts.space.key'), description: tGame('help.shortcuts.space.description') },
    { key: tGame('help.shortcuts.shiftSpace.key'), description: tGame('help.shortcuts.shiftSpace.description') },
    { key: tGame('help.shortcuts.flag.key'), description: tGame('help.shortcuts.flag.description') },
    { key: tGame('help.shortcuts.question.key'), description: tGame('help.shortcuts.question.description') },
  ];

  const gameRules = [
    { title: tGame('help.rules.objective.title'), content: tGame('help.rules.objective.content') },
    { title: tGame('help.rules.numbers.title'), content: tGame('help.rules.numbers.content') },
    { title: tGame('help.rules.flagging.title'), content: tGame('help.rules.flagging.content') },
    { title: tGame('help.rules.chording.title'), content: tGame('help.rules.chording.content') },
    { title: tGame('help.rules.safeStart.title'), content: tGame('help.rules.safeStart.content') },
  ];

  const scoringSystem = [
    { action: tGame('help.scoring.openCell.action'), points: tGame('help.scoring.openCell.points') },
    { action: tGame('help.scoring.placeFlag.action'), points: tGame('help.scoring.placeFlag.points') },
    { action: tGame('help.scoring.removeFlag.action'), points: tGame('help.scoring.removeFlag.points') },
    { action: tGame('help.scoring.chordClick.action'), points: tGame('help.scoring.chordClick.points') },
    { action: tGame('help.scoring.gameWin.action'), points: tGame('help.scoring.gameWin.points') },
  ];

  return (
    <Dialog>
      <Tooltip content={tGame('settings.help')}>
        <DialogTrigger asChild>
          <ButtonMotion>
            <Button size="sm" variant="outline" className="h-9 w-9 p-0">
              ❓
            </Button>
          </ButtonMotion>
        </DialogTrigger>
      </Tooltip>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto pr-3">
        <DialogHeader>
          <DialogTitle className="text-xl">{tGame('help.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Rules */}
          <FadeInMotion>
            <h3 className="font-semibold text-lg mb-3 text-primary">{tGame('help.gameRules')}</h3>
            <div className="space-y-2">
              {gameRules.map((rule, index) => (
                <div key={index} className="flex gap-3 p-2 rounded border-l-2 border-primary/20 bg-muted/30">
                  <span className="font-medium text-sm min-w-fit">{rule.title}:</span>
                  <span className="text-sm text-muted-foreground">{rule.content}</span>
                </div>
              ))}
            </div>
          </FadeInMotion>

          {/* Keyboard Shortcuts */}
          <FadeInMotion>
            <h3 className="font-semibold text-lg mb-3 text-primary">{tGame('help.keyboardShortcuts')}</h3>
            <div className="grid gap-2">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/30">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{shortcut.key}</code>
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </FadeInMotion>

          {/* Scoring System */}
          <FadeInMotion>
            <h3 className="font-semibold text-lg mb-3 text-primary">{tGame('help.scoringSystem')}</h3>
            <div className="grid gap-2">
              {scoringSystem.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/30">
                  <span className="text-sm">{item.action}</span>
                  <span className="text-sm font-medium text-primary">{item.points}</span>
                </div>
              ))}
            </div>
          </FadeInMotion>

          <div className="text-center text-sm text-muted-foreground border-t pt-4">{tGame('help.tip')}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
