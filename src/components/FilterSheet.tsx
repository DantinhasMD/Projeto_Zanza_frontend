import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Filter } from 'lucide-react';
import { Badge } from './ui/badge';

const neighborhoods = [
  'Cambuí', 'Centro', 'Botafogo', 'Castelo', 'Taquaral', 'Nova Campinas',
  'Jardim Guanabara', 'Cidade Universitária', 'Barão Geraldo', 'Sousas',
  'Jardim Chapadão', 'Jardim Santa Genebra', 'Jardim Campos Elíseos',
  'Jardim Nova Europa','Jardim Santa Cândida', 'Jardim São Bernardo',
  'Jardim Satélite Íris', 'Vida Nova', 'Parque da Vila União'
];

const timeSlots = [
  { id: 'morning', label: 'Manhã (6h - 11h)', icon: '🌅' },
  { id: 'afternoon', label: 'Tarde (11h - 17h)', icon: '☀️' },
  { id: 'evening', label: 'Noite (17h - 21h)', icon: '🌙' },
  { id: 'dawn', label: 'Madrugada (21h - 6h)', icon: '🌃' },
];

export function FilterSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-[#f5f5f3] text-gray-700 hover:bg-gray-200 border border-gray-200 rounded-xl px-4">
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-white">
        <SheetHeader>
          <SheetTitle>Filtros do mapa</SheetTitle>
          <SheetDescription>
            Personalize as ruas visíveis por bairro, horário e segurança
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6 overflow-y-auto h-[calc(100%-120px)] pb-6">
          {/* Neighborhoods */}
          <div>
            <h3 className="mb-3">Bairros</h3>
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((neighborhood) => (
                <Badge
                  key={neighborhood}
                  variant="outline"
                  className="cursor-pointer hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4] transition-colors"
                >
                  {neighborhood}
                </Badge>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="mb-3">Horários críticos</h3>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox id={slot.id} />
                  <Label htmlFor={slot.id} className="flex items-center gap-2 flex-1 cursor-pointer">
                    <span className="text-xl">{slot.icon}</span>
                    <span>{slot.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Level */}
          <div>
            <h3 className="mb-3">Nível de segurança</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 bg-[#34A853]/10 rounded-lg border border-[#34A853]/20">
                <Checkbox id="safe" defaultChecked />
                <Label htmlFor="safe" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <div className="w-3 h-3 bg-[#34A853] rounded-full" />
                  <span>Seguro (4.0+)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-[#FBBC04]/10 rounded-lg border border-[#FBBC04]/20">
                <Checkbox id="warning" defaultChecked />
                <Label htmlFor="warning" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <div className="w-3 h-3 bg-[#FBBC04] rounded-full" />
                  <span>Atenção (2.5 - 3.9)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-[#EA4335]/10 rounded-lg border border-[#EA4335]/20">
                <Checkbox id="danger" defaultChecked />
                <Label htmlFor="danger" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <div className="w-3 h-3 bg-[#EA4335] rounded-full" />
                  <span>Perigoso (0 - 2.4)</span>
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button className="w-full bg-[#4285F4] hover:bg-[#3367D6]">
            Aplicar filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
