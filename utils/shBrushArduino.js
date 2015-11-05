/**
 * This is a file to syntax highlight Arduino code using SyntaxHighlighter,
 * including advanced features such as native AVR defines and functions
 *
 * The brush was written by Jonathan Guberman
 * http://upnotnorth.net
 *
 * SyntaxHighlighter is written by Alex Gorbatchev as donationware.
 * If you are using it, please consider making a donation.
 * http://alexgorbatchev.com/
 *
 * This brush file is released to the public domain. Do with it as you see fit.
 * However, I'd appreciate it if you continued to credit me and leave in the 
 * reference to my website (http://upnotnorth.net).
 */
SyntaxHighlighter.brushes.arduino = function()
{
	var datatypes =	'boolean char byte int long float double void unsigned volatile word string static const';

	var keywords =	'setup loop if else for switch case default while do break continue return';
					
	var functions =	'pinMode digitalWrite digitalRead analogRead analogWrite shiftOut pulseIn ' +
			'millis micros delay delayMicroseconds min max abs constrain ' +
			'map pow sq sqrt sin cos tan randomSeed random ' + 
			'sizeof lowByte highByte bitRead bitWrite bitSet bitClear bit tone noTone' +
			'attachInterrupt detachInterrupt interrupts noInterrupts ' +
			'Serial\\.begin Serial\\.available Serial\\.read Serial\\.flush ' + 
			'Serial\\.print Serial\\.println Serial\\.write ' +
			'EEPROM\\.read EEPROM\\.write ' +
			'Ethernet\\.begin Ethernet\\.Server Ethernet\\.available Ethernet\\.write ' + 
			'Ethernet\\.print Ethernet\\.println Ethernet\\.Client Ethernet\\.connected ' + 
			'Ethernet\\.connect Ethernet\\.write Ethernet\\.print Ethernet\\.println ' + 
			'Ethernet\\.read Ethernet\\.flush Ethernet\\.stop ' +
			'Firmata\\.begin Firmata\\.printVersion Firmata\\.printFirmwareVersion ' +
			'Firmata\\.setFirmwareVersion Firmata\\.sendAnalog Firmata\\.sendDigitalPorts ' +
			'Firmata\\.sendDigitalPortPair Firmata\\.sendSysex Firmata\\.sendString '
			'Firmata\\.available Firmata\\.processInput Firmata\\.attach Firmata\\.detach ' +
			'Wire\\.begin Wire\\.requestFrom Wire\\.beginTransmission Wire\\.endTransmission ' +
			'Wire\\.send Wire\\.available Wire\\.receive Wire\\.onReceive Wire\\.onRequest ';
					
	var constants = 'HIGH LOW INPUT OUTPUT true false CHANGE RISING FALLING';
	
	var AVRdefines = 'PGM_P PGM_VOID_P PROGMEM __EEPROF2021 ACBG ACD ACI ACIC ACIE ACIS[01] ACME ACO ACSR ADATE ADC ADC_vect ADC[0-5]D ADC[HL] ADCSR[AB] ADCW ADEN ADI[EF] ADLAR ADMUX ADPS[0-2] ADSC ADTS[0-2] AIN[01]D ANALOG_COMP_vect AS2 ASSR BLBSET BORF CLKPCE CLKPR CLKPS[0-3] COM[0-2][AB][01] CPHA CPOL CS[0-2][0-2] DD[B-D][0-6] DD[BD]7 DDR[B-D] DIDR[01] DOR[0D] EE_READY_vect EE[ACD]R EEAR[HL] EEM?PE EEPM[01] EERI?E EICRA EIFR EIMSK EXCLK EXTRF FE0 FOC[0-2][AB] GPIOR[0-2] GTCCR ICES1 ICF1 ICIE1 ICNC1 ICR1[HL]? INT[01](_vect)? INTF[01] ISC[01][01] IVCE IVSEL MCU[CS]R MONDR MPCM0 MSTR MUX[0-3] OCF[0-2][AB] OCIE[0-2][AB] OCR1[AB][HL] OCR[0-2][AB] OCR2[AB]UB OSCCAL P[BCD][0-6] P[BD]7 PCI[CF]R PCI[EF][0-2] PCINT1?[0-9] PCINT[0-2]_vect PCINT2[0-3] PCMSK[0-2] PGERS PGWRT PIN[BCD][0-6]? PIN[BD]7 PORF PORT[BCD] PRADC PRR PRSPI PRTIM[0-2] PRTWI PRUSART PSRASY PSRSYNC PUD REFS[01] RWWSB RWWSRE RXB80 RXC0 RXCIE0 RXEN0 SE SELFPRG SIG_2WIRE_SERIAL SIG_ADC SIG_COMPARATOR SIG_EEPROM_READY SIG_INPUT_CAPTURE1 SIG_INTERRUPT[01] SIG_OUTPUT_COMPARE[0-2][AB] SIG_OVERFLOW[0-2] SIG_PIN_CHANGE[0-2] SIG_SPI SIG_SPM_READY SIG_TWI SIG_USART_DATA SIG_USART_RECV SIG_USART_TRANS SIG_WATCHDOG_TIMEOUT SM[0-2] SMCR SP[CD]R SPE SPI_STC_vect SPI2X SPI[EF] SPM_READY_vect SPMCSR SPMEN SPMIE SPR[01] SPSR TCCR[0-2][AB] TCCR1C TCN2UB TCNT[02] TCNT1[HL]? TCR2[AB]UB TIFR[0-2] TIMER[0-2]_COMP[AB]_vect TIMER[0-2]_OVF_vect TIMER1_CAPT_vect TIMSK[0-2] TOIE[0-2] TOV[0-2] TSM TWAM?[0-6] TWAMR TW[A-D]R TWE[AN] TWGCE TWI_vect TWIE TWINT TWPS[01] TWS[3-7R] TWST[AO] TWWC TXB80 TXC0 TXCIE0 TXEN0 U2X0 UBRR0[HL]? UCPHA0 UCPOL0 UCSR0[A-C] UCSZ0[0-2] UDORD0 UDR0 UDRE?0 UDRIE0 UMSEL0[01] UPE0 UPM0[01] USART_[RT]X_vect USART_UDRE_vect USBS0 WCOL WDC?E WDI[EF] WDP[0-3] WDRF WDT_vect WDTCSR WGM[0-2][0-2] WGM13';
	var AVRfunctions = 'sei cli ISR SIGNAL EMPTY_INTERRUPT ISR_ALIAS nop _BV pgm_read_byte pgm_read_word pgm_read_dword pgm_read_float';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' }			// one line comments
		,{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' }			// multiline comments
		,{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' }			// strings
		,{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' }			// strings
		,{ regex: /^ *#(.)+?\b/gm,									css: 'preprocessor' }		// preprocessor directives
		,{ regex: new RegExp(this.getKeywords(datatypes), 'gm'),		css: 'color1 bold' } 		// datatypes
		,{ regex: new RegExp(this.getKeywords(functions), 'gm'),		css: 'functions' } 	// functions
		,{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword bold' } 		// control flow
		,{ regex: new RegExp(this.getKeywords(constants), 'gm'),		css: 'constants bold' } 	// predefined constants
		,{ regex: /\b(\d*\.\d+([Ee]-?\d{1,3})?)|(\d+[Ee]-?\d{1,3})\b/gm,	css: 'constants'} // numeric constants (floating point)
		,{ regex: /\b\d+[uU]?[lL]?\b/gm,								css: 'constants'} 	// numeric constants (decimal)
		,{ regex: /\b0x[0-9A-Fa-f]+[uU]?[lL]?\b/gm,					css: 'constants'} 	// numeric constants (hexidecimal)
		,{ regex: /\bB[01]{1,8}\b/gm,								css: 'constants'} 	// numeric constants (binary)
		,{ regex: /\+|\-|\*|\/|\%|!|\||\&amp;|=|\?|\^|~/gm, 			css: 'plain bold' }		// operators
		,{ regex: new RegExp(this.getKeywords(AVRdefines), 'gm'),	css: 'constants italic'}	// AVR defines
		,{ regex: new RegExp(this.getKeywords(AVRfunctions), 'gm'),	css: 'functions italic'}	// AVR functions
        //,{ regex: /\b(?:\w+?(?=\(.*?\)\W))/gm,							css: 'plain italic'}		// Other functions/macros (i.e. user-defined)        
		];
};

SyntaxHighlighter.brushes.arduino.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.arduino.aliases	= ['arduino'];
